import os
import json
import csv
import sys
import random
from groq import Groq
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import speech_recognition as sr
import langdetect
from dotenv import load_dotenv
import argparse

load_dotenv()

class LegalAnalysisChatbot:
    def __init__(self, api_key=None):
        """
        Initialize the Legal Analysis Chatbot
        """
        # Groq client initialization
        self.api_key = os.environ.get('GROQ_API_KEY')
        self.client = Groq(api_key=self.api_key)
        
        # Case categories
        self.case_categories = [
            "Eviction", 
            "Wage Theft", 
            "Employment Discrimination", 
            "Contract Dispute", 
            "Consumer Rights", 
            "Family Law", 
            "Immigration"
        ]
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Conversation history
        self.conversation_history = []
        self.current_case_analysis = None
    
    def detect_language(self, text):
        """Detect the language of the input text"""
        try:
            return langdetect.detect(text)
        except:
            return "en"  # Default to English if detection fails
    
    def generate_follow_up_response(self, input_text):
        """
        Generate a response for follow-up questions based on previous case analysis
        
        Args:
            input_text (str): User's follow-up question
        
        Returns:
            dict: Response to the follow-up question
        """
        if not self.current_case_analysis:
            return {
                "status": "error",
                "message": "No previous case analysis available. Please start with a new case description."
            }
        
        # Prepare system and user messages for follow-up
        messages = [
            {
                "role": "system", 
                "content": f"""You are an advanced legal analysis AI assistant specializing in Indian law. 
                You are currently discussing a {self.current_case_analysis.get('case_category', 'legal')} case.

                Previous Case Analysis:
                {json.dumps(self.current_case_analysis, indent=2)}

                Your task is to:
                1. Understand the context of the previous case analysis
                2. Provide a precise and relevant response to the follow-up question
                3. Maintain the professional and comprehensive tone of the previous analysis
                4. Provide additional insights or clarifications

                Respond in a structured JSON format similar to the previous analysis."""
            },
            {
                "role": "user", 
                "content": f"Follow-up question regarding the previous case analysis:\n{input_text}"
            }
        ]
        
        try:
            # Create completion using Groq's DeepSeek model
            completion = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.6,
                max_tokens=4096,
                top_p=0.95,
                stream=False
            )
            
            # Extract and parse the response
            response_text = completion.choices[0].message.content
            result = json.loads(response_text)
            
            return result
        
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def understand_case(self, input_text):
        """
        Analyze the case details using Groq's DeepSeek model
        
        Args:
            input_text (str): User-provided case description
        
        Returns:
            dict: Comprehensive case understanding
        """
        # Detect input language
        input_language = self.detect_language(input_text)
        
        # Prepare system message with categories
        categories_str = ', '.join(self.case_categories)

        # Prepare comprehensive system and user messages
        messages = [
            {
                "role": "system", 
                "content": f"""You are an advanced multilingual legal analysis AI assistant specializing in Indian law. 
                Your comprehensive task is to provide a detailed legal analysis with multiple components:

                I. CASE CATEGORIZATION AND KEY DETAILS
                - Identify the precise case category from: {categories_str}
                - Extract critical key details from the case description
                - Perform a preliminary risk assessment based on previous similar cases

                II. STEP-BY-STEP LEGAL GUIDANCE
                Provide a comprehensive legal strategy including:
                1. Immediate actionable steps
                2. Evidence collection strategy
                3. Potential legal actions
                4. Recommended documentation
                5. Statute of limitations
                6. Potential legal resources

                III. LEGAL CLAUSES AND STATUTORY REFERENCES
                1. Identify specific legal statutes relevant to the case
                2. Provide explanation of each applicable clause
                3. Demonstrate direct relevance to the current case

                ADDITIONAL REQUIREMENTS:
                - If the input is in Hindi, respond in Hindi; otherwise, use English
                - Focus solely on legal and law-related questions. If any questions out of domain dont generate a json response and just give a message politely denying.
                - All the legal clauses should be according to the indian law
                - Be precise, professional, and provide clear, actionable guidance
                - Structure the entire response as a comprehensive JSON object

                OUTPUT JSON TEMPLATE:
                {{
                    "case_category": "...",
                    "input_language": "...",
                    "key_details": {{
                        "description": "...",
                        "primary_issues": ["..."],
                        "potential_violations": ["..."]
                    }},
                    "preliminary_risk_assessment": {{
                        "complexity": "...",
                        "potential_impact": "..."
                    }},
                    "recommended_next_steps": ["..."],
                    "step_by_step_guidance": {{
                        "immediate_steps": ["..."],
                        "evidence_collection": ["..."],
                        "legal_actions": ["..."],
                        "documentation": ["..."],
                        "statute_of_limitations": "...",
                        "legal_resources": ["..."]
                    }},
                    "legal_clauses": {{
                        "statutes": [
                            {{
                                "name": "...",
                                "explanation": "...",
                                "relevance": "..."
                            }}
                        ]
                    }}
                }}"""
            },
            {
                "role": "user", 
                "content": f"Analyze this legal case description:\n{input_text}"
            }
        ]
        
        try:
            # Create completion using Groq's DeepSeek model
            completion = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.6,
                max_tokens=4096,
                top_p=0.95,
                stream=False
            )
            
            # Extract and parse the response
            response_text = completion.choices[0].message.content
            result = json.loads(response_text)
            
            # Store current case analysis for context
            self.current_case_analysis = result
            self.conversation_history.append({
                "type": "initial_analysis",
                "content": result
            })
            
            return result
        
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

def print_formatted_response(response):
    """
    Print the response in a formatted, readable manner
    
    Args:
        response (dict): Response from the legal analysis
    """
    if response.get("status") == "error":
        print(f"Error: {response.get('message', 'Unknown error')}")
        return
    
    print("\n== Legal Case Analysis ==")
    
    # Print case category
    print(f"\nCase Category: {response.get('case_category', 'Not specified')}")
    
    # Print key details
    key_details = response.get('key_details', {})
    print("\nKey Details:")
    print(f"Description: {key_details.get('description', 'N/A')}")
    print("Primary Issues:")
    for issue in key_details.get('primary_issues', []):
        print(f"  - {issue}")
    
    # Print recommended next steps
    print("\nRecommended Next Steps:")
    for step in response.get('recommended_next_steps', []):
        print(f"  - {step}")
    
    # Print step-by-step guidance
    guidance = response.get('step_by_step_guidance', {})
    print("\nStep-by-Step Guidance:")
    for key, steps in guidance.items():
        print(f"\n{key.replace('_', ' ').title()}:")
        if isinstance(steps, list):
            for step in steps:
                print(f"  - {step}")
        else:
            print(f"  {steps}")
    
    # Print legal clauses
    legal_clauses = response.get('legal_clauses', {}).get('statutes', [])
    print("\nRelevant Legal Clauses:")
    for clause in legal_clauses:
        print(f"\n{clause.get('name', 'Unnamed Statute')}:")
        print(f"  Explanation: {clause.get('explanation', 'N/A')}")
        print(f"  Relevance: {clause.get('relevance', 'N/A')}")

def main():
    """
    Main function to run the Legal Analysis Chatbot
    """
    print("Welcome to the Legal Analysis Chatbot!")
    print("Type 'exit' to quit, or 'new' to start a new case analysis.")
    
    # Initialize the chatbot
    chatbot = LegalAnalysisChatbot()
    
    while True:
        user_input = input("\n>>> ").strip()
        
        # Exit condition
        if user_input.lower() == 'exit':
            print("Thank you for using the Legal Analysis Chatbot. Goodbye!")
            break
        
        # New case condition
        if user_input.lower() == 'new':
            chatbot.current_case_analysis = None
            chatbot.conversation_history = []
            print("Ready for a new case analysis. Please describe your legal situation.")
            continue
        
        try:
            # Determine if this is an initial case or a follow-up
            if not chatbot.current_case_analysis:
                # Initial case analysis
                response = chatbot.understand_case(user_input)
            else:
                # Follow-up question
                response = chatbot.generate_follow_up_response(user_input)
            
            # Print formatted response
            print_formatted_response(response)
        
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()