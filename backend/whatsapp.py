import os
import json
import langdetect
from googletrans import Translator
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
from dotenv import load_dotenv

# Import the existing LegalAnalysisChatbot from the previous script
from app_working_chatbot import LegalAnalysisChatbot

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize Twilio Client
twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
twilio_client = Client(twilio_account_sid, twilio_auth_token)

# Initialize Translator
translator = Translator()

# Initialize Legal Analysis Chatbot
legal_chatbot = LegalAnalysisChatbot()

# Conversation context storage (In a production app, use a database)
conversation_contexts = {}
conversation_languages = {}

def detect_language(text):
    """
    Detect the language of the input text
    
    Args:
        text (str): Input text
    
    Returns:
        str: Detected language code
    """
    try:
        return langdetect.detect(text)
    except:
        return 'en'  # Default to English if detection fails

def translate_text(text, target_language='en'):
    """
    Translate text to target language
    
    Args:
        text (str): Input text
        target_language (str): Target language code
    
    Returns:
        str: Translated text
    """
    try:
        translation = translator.translate(text, dest=target_language)
        return translation.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def format_response_for_whatsapp(result, target_language='en'):
    """
    Format the legal analysis result for WhatsApp messaging
    
    Args:
        result (dict): Legal analysis result
        target_language (str): Language to translate response to
    
    Returns:
        str: Formatted response message
    """
    # Basic error handling
    if 'status' in result and result['status'] == 'error':
        error_msg = "Sorry, there was an error processing your request. Please try again."
        return translate_text(error_msg, target_language)
    
    # Format the response with key sections
    response_parts = []

    # Add messages if present (for follow-up responses)
    if 'messages' in result:
        response_parts.append(f"{result.get('messages')}")
    
    # Case Category
    response_parts.append(f"*Case Category:* {result.get('case_category', 'Not Specified')}")
    
    # Key Details
    key_details = result.get('key_details', {})
    response_parts.append("\n*Key Details:*")
    response_parts.append(f"Description: {key_details.get('description', 'N/A')}")
    
    if key_details.get('primary_issues'):
        response_parts.append("Primary Issues:")
        for issue in key_details['primary_issues']:
            response_parts.append(f"- {issue}")
    
    # Recommended Next Steps
    response_parts.append("\n*Recommended Next Steps:*")
    for step in result.get('recommended_next_steps', ['Consult with a legal professional']):
        response_parts.append(f"- {step}")
    
    # Legal Guidance
    guidance = result.get('step_by_step_guidance', {})
    response_parts.append("\n*Legal Guidance:*")
    response_parts.append(f"Immediate Steps: {', '.join(guidance.get('immediate_steps', ['Consult lawyer']))}")
    response_parts.append(f"Statute of Limitations: {guidance.get('statute_of_limitations', 'Verify with legal expert')}")

    response_parts.append("\n*Case Duration:*")
    response_parts.append(f"The case will take approximately {result.get('case_duration', 'Not Specified')}")
    
    # Legal Resources
    if guidance.get('legal_resources'):
        response_parts.append("\n*Legal Resources:*")
        for resource in guidance['legal_resources']:
            response_parts.append(f"- {resource}")
    
    # Follow-up response details
    if result.get('follow_up_details'):
        response_parts.append("\n*Follow-up Details:*")
        response_parts.append(result.get('follow_up_details', 'No additional details'))
    
    # Combine response
    combined_response = "\n".join(response_parts)
    
    # Translate if needed
    if target_language != 'en':
        combined_response = translate_text(combined_response, target_language)
    
    return combined_response

def is_follow_up_question(input_text):
    """
    Determine if the input is likely a follow-up question
    
    Args:
        input_text (str): User's input text
    
    Returns:
        bool: True if input seems like a follow-up, False otherwise
    """
    follow_up_indicators = [
        'elaborate', 'explain more', 'details about', 'tell me more', 
        'further information', 'additional context', 'more about', 
        'clarify', 'expand on',
        # Hindi follow-up indicators
        'विस्तार से', 'और बताएं', 'अधिक जानकारी', 'समझाइए', 'और विवरण'
    ]
    
    # Convert input to lowercase for case-insensitive matching
    lower_input = input_text.lower()
    
    # Check if any follow-up indicator is in the input
    return any(indicator in lower_input for indicator in follow_up_indicators)

@app.route('/whatsapp', methods=['POST'])
def whatsapp_webhook():
    """
    Webhook for handling WhatsApp messages
    """
    # Get incoming message details
    from_number = request.form.get('From', '')
    message_body = request.form.get('Body', '').strip()
    
    # Initialize Twilio messaging response
    response = MessagingResponse()
    
    try:
        # Detect input language
        input_language = detect_language(message_body)
        
        # Translate to English if not already in English
        if input_language != 'en':
            translated_message = translate_text(message_body)
        else:
            translated_message = message_body
        
        # Retrieve conversation context if exists
        previous_context = conversation_contexts.get(from_number)
        previous_language = conversation_languages.get(from_number, 'en')
        
        # Check if this is a follow-up question
        if previous_context and is_follow_up_question(message_body):
            # Process follow-up question with context
            result = legal_chatbot.process_follow_up_question(
                translated_message, 
                previous_context
            )
        else:
            # Analyze the case as a new query
            result = legal_chatbot.understand_case(
                translated_message, 
                previous_context
            )
        
        # Format response for WhatsApp
        formatted_response = format_response_for_whatsapp(
            result, 
            target_language=input_language
        )
        
        # Send response via Twilio
        message = twilio_client.messages.create(
            from_=f'{os.environ.get("TWILIO_WHATSAPP_NUMBER")}',
            body=formatted_response,
            to=from_number
        )
        
        # Store current context and language for future follow-ups
        conversation_contexts[from_number] = result
        conversation_languages[from_number] = input_language
        
    except Exception as e:
        # Send error message
        error_message = f"An error occurred: {str(e)}"
        twilio_client.messages.create(
            from_=f'whatsapp:{os.environ.get("TWILIO_WHATSAPP_NUMBER")}',
            body=error_message,
            to=from_number
        )
    
    return str(response)

if __name__ == '__main__':
    # Ensure environment variables are set
    required_vars = [
        'TWILIO_ACCOUNT_SID', 
        'TWILIO_AUTH_TOKEN', 
        'TWILIO_WHATSAPP_NUMBER',
        'GROQ_API_KEY'
    ]
    
    for var in required_vars:
        if not os.environ.get(var):
            print(f"Error: {var} environment variable is not set")
            exit(1)
    
    # Run the Flask app
    app.run(debug=True, port=8080)