import os
import json
import csv
import sys
import random
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from groq import Groq
import speech_recognition as sr
import langdetect
from dotenv import load_dotenv
import argparse

load_dotenv()
maxInt = sys.maxsize

while True:
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

class ComprehensiveLegalAnalysisModel:
    def __init__(self, api_key=None):
        """
        Initialize the Groq client for comprehensive legal case understanding
        
        Args:
            api_key (str, optional): Groq API key. Defaults to environment variable.
        """
        self.api_key = os.environ.get('GROQ_API_KEY')
        self.client = Groq(api_key=self.api_key)
        
        # Predefined case categories
        self.case_categories = [
            "Eviction", 
            "Wage Theft", 
            "Employment Discrimination", 
            "Contract Dispute", 
            "Consumer Rights", 
            "Family Law", 
            "Immigration"
        ]
        
        # Load past legal cases dataset
        self.past_cases = self.load_past_cases()
    
    def load_past_cases(self):
        """
        Load past legal cases from CSV
        
        Returns:
            list: List of past legal cases
        """
        try:
            past_cases_path = os.path.join(os.path.dirname(__file__), 'train.csv')
            with open(past_cases_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                print('Dataset loaded')
                return list(reader)
        except Exception as e:
            print(f"Error loading past cases: {e}")
            return []
    
    def find_similar_cases(self, case_category, key_details):
        """
        Find similar past legal cases
        
        Args:
            case_category (str): Case category
            key_details (dict): Key details of the current case
        
        Returns:
            list: List of similar past cases
        """
        similar_cases = [
            case for case in self.past_cases 
            if case.get('category', '').lower() == case_category.lower()
        ]
        
        return random.sample(similar_cases, min(3, len(similar_cases)))
    
    def calculate_risk_probability(self, similar_cases, key_details):
        """
        Calculate risk probability based on similar cases
        
        Args:
            similar_cases (list): List of similar past cases
            key_details (dict): Key details of the current case
        
        Returns:
            dict: Risk assessment details
        """
        # Basic risk calculation logic
        total_success = sum(1 for case in similar_cases if case.get('outcome', '').lower() == 'success')
        success_probability = (total_success / len(similar_cases)) * 100 if similar_cases else 50
        
        # Estimated compensation range
        compensation_estimates = [float(case.get('compensation', 0)) for case in similar_cases if case.get('compensation')]
        avg_compensation = sum(compensation_estimates) / len(compensation_estimates) if compensation_estimates else 0
        
        return {
            "success_probability": round(success_probability, 2),
            "estimated_compensation": round(avg_compensation, 2),
            "similar_cases_count": len(similar_cases)
        }
    
    def generate_step_by_step_guidance(self, case_details):
        """
        Generate comprehensive step-by-step legal guidance
        
        Args:
            case_details (dict): Case details
        
        Returns:
            dict: Step-by-step guidance
        """
        messages = [
            {
                "role": "system",
                "content": """You are an expert multilingual legal advisor providing comprehensive 
                step-by-step guidance for legal cases in India. For each case, provide:
                1. Immediate steps to take
                2. Evidence collection strategy
                3. Potential legal actions
                4. Recommended documentation
                5. Statute of limitations
                6. Potential legal resources
                
                If the user query is in Hindi then respond in Hindi as well else English. Also you are supposed to give answers based on
                legal or law related questions only. if the question is from other domain then dont generate a JSON response and politely deny.
                Respond in a structured, actionable JSON format."""
            },
            {
                "role": "user",
                "content": json.dumps(case_details)
            }
        ]
        
        try:
            completion = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.6,
                max_tokens=4096
            )
            
            return json.loads(completion.choices[0].message.content)
        
        except Exception as e:
            return {"error": str(e)}
    
    def retrieve_legal_clauses(self, case_details):
        """
        Retrieve relevant legal clauses
        
        Args:
            case_details (dict): Case details
        
        Returns:
            dict: Legal clauses and explanations
        """
        messages = [
            {
                "role": "system",
                "content": """You are a multilingual legal expert providing detailed indian legal clause 
                information. For the given case, provide:
                1. Specific legal statutes
                2. Brief explanation of each clause
                3. Direct relevance to the current case

                If the user query is in Hindi then respond in Hindi as well else English. Also you are supposed to give answers based on
                legal or law related questions only. if the question is from other domain then dont generate a JSON response and politely deny.                
                Respond in a structured, informative JSON format."""
            },
            {
                "role": "user",
                "content": json.dumps(case_details)
            }
        ]
        
        try:
            completion = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.6,
                max_tokens=4096
            )
            
            return json.loads(completion.choices[0].message.content)
        
        except Exception as e:
            return {"error": str(e)}
    
    def detect_language(self, text):
        """Detect the language of the input text"""
        try:
            return langdetect.detect(text)
        except:
            return "en"  # Default to English if detection fails
    
    def transcribe_audio(self, audio_file):
        """Transcribe audio file to text"""
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
                return text
            except sr.UnknownValueError:
                return "Audio could not be understood"
            except sr.RequestError:
                return "Could not request results from speech recognition service"
    
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
        
        # Prepare system and user messages
        messages = [
            {
                "role": "system", 
                "content": f"""You are an advanced multilingual legal analysis AI assistant. 
                Your task is to carefully analyze indian legal case descriptions and provide 
                comprehensive insights. Always structure your response as a JSON object 
                with the following keys:
                
                - case_category: One of {', '.join(self.case_categories)}
                - key_details: Extracted key information from the case description
                - preliminary_risk_assessment: Brief overview of potential legal risks
                - recommended_next_steps: Actionable advice for the user
                
                If the user query is in Hindi then respond in Hindi as well else English. Also you are supposed to give answers based on
                legal or law related questions only. if the question is from other domain then dont generate a JSON response and politely deny.
                Be precise, professional, and focus on providing clear, actionable guidance."""
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
                stream=False  # Set to False for complete response
            )
            
            # Extract the response
            response_text = completion.choices[0].message.content
            
            # Parse the JSON response
            result = json.loads(response_text)

            # if result['status'] == 'success':
            # case_details = result['analysis']
            
            # Find similar cases
            similar_cases = self.find_similar_cases(
                result.get('case_category', '')[0], 
                result.get('key_details', {})
            )
            
            # Risk assessment
            risk_assessment = self.calculate_risk_probability(
                similar_cases, 
                result.get('key_details', {})
            )
            result['risk_assessment'] = risk_assessment
            
            # Step-by-step guidance
            result['step_by_step_guidance'] = self.generate_step_by_step_guidance(result)
            
            # Legal clause retrieval
            result['legal_clauses'] = self.retrieve_legal_clauses(result)
            
            return result
            
            return {
                "status": "success",
                "input_language": input_language,
                "analysis": result
            }
        
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def stream_case_understanding(self, input_text):
        """
        Stream the case understanding response
        
        Args:
            input_text (str): User-provided case description
        
        Yields:
            str: Streaming response chunks
        """
        # Prepare system and user messages (similar to understand_case)
        messages = [
            {
                "role": "system", 
                "content": f"""You are an advanced legal analysis AI assistant. 
                Analyze legal case descriptions providing insights."""
            },
            {
                "role": "user", 
                "content": f"Analyze this legal case description:\n{input_text}"
            }
        ]
        
        try:
            # Create streaming completion
            completion = self.client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=messages,
                temperature=0.6,
                max_tokens=4096,
                top_p=0.95,
                stream=True
            )
            
            # Stream the response
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        
        except Exception as e:
            yield f"Error: {str(e)}"

def main():
    """
    Main function to run the Legal Analysis Model from the command line
    """
    parser = argparse.ArgumentParser(description='Comprehensive Legal Analysis Tool')
    
    # Add mutually exclusive group for input types
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument('-t', '--text', help='Text description of the legal case')
    input_group.add_argument('-a', '--audio', help='Path to audio file containing case description')
    
    # Additional optional arguments
    parser.add_argument('-o', '--output', help='Path to save the output JSON file')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose output')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Initialize the legal analysis model
    legal_model = ComprehensiveLegalAnalysisModel()
    
    try:
        # Determine input method
        if args.text:
            # Analyze text input
            case_analysis = legal_model.understand_case(args.text)
        elif args.audio:
            # Transcribe and analyze audio input
            transcribed_text = legal_model.transcribe_audio(args.audio)
            case_analysis = legal_model.understand_case(transcribed_text)
        
        # Handle output
        if args.output:
            # Save to JSON file
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(case_analysis, f, indent=4)
            print(f"Analysis saved to {args.output}")
        
        # Verbose output
        if args.verbose:
            print(json.dumps(case_analysis, indent=4))
        
        return case_analysis
    
    except Exception as e:
        print(f"Error in legal case analysis: {e}")
        return None

if __name__ == "__main__":
    main()