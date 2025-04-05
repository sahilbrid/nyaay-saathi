import os
import json
import csv
import sys
import random
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from groq import Groq
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
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
        Initialize the Groq client and embedding model for comprehensive legal case understanding
        
        Args:
            api_key (str, optional): Groq API key. Defaults to environment variable.
        """
        # Existing initialization
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
        
        # Load past cases and generate embeddings
        self.past_cases = self.load_past_cases()
        self.case_embeddings = self.generate_case_embeddings()
    
    def generate_case_embeddings(self):
        """
        Generate embeddings for past cases
        
        Returns:
            numpy.ndarray: Embedding matrix for past cases
        """
        # Combine relevant case details into a single text representation
        case_texts = []
        for case in self.past_cases:
            # Combine key case details into a single text
            case_text = " ".join([
                str(case.get('category', '')),
                str(case.get('description', '')),
                str(case.get('key_details', '')),
                str(case.get('outcome', ''))
            ])
            case_texts.append(case_text)
        
        # Generate embeddings
        embeddings = self.embedding_model.encode(case_texts)
        return embeddings
    
    def find_similar_cases(self, case_category, key_details):
        """
        Find similar past legal cases using embedding similarity
        
        Args:
            case_category (str): Case category
            key_details (dict): Key details of the current case
        
        Returns:
            list: List of similar past cases with similarity scores
        """
        # Prepare the current case text for embedding
        current_case_text = " ".join([
            case_category,
            json.dumps(key_details)
        ])
        
        # Generate embedding for the current case
        current_case_embedding = self.embedding_model.encode([current_case_text])
        
        # Calculate cosine similarities
        similarities = cosine_similarity(current_case_embedding, self.case_embeddings)[0]
        
        # Create a list of cases with their similarity scores
        scored_cases = [
            {
                'case': case, 
                'similarity_score': score
            } 
            for case, score in zip(self.past_cases, similarities)
        ]
        
        # Sort cases by similarity score in descending order
        sorted_cases = sorted(
            scored_cases, 
            key=lambda x: x['similarity_score'], 
            reverse=True
        )
        
        # Filter and return top 3 similar cases
        filtered_cases = [
            case['case'] for case in sorted_cases 
            if case['similarity_score'] > 0.5  # Adjust threshold as needed
        ][:3]
        
        return filtered_cases
    
    def load_past_cases(self):
        """
        Load past legal cases from CSV with additional preprocessing
        
        Returns:
            list: List of past legal cases
        """
        try:
            past_cases_path = os.path.join(os.path.dirname(__file__), 'train.csv')
            with open(past_cases_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                cases = list(reader)
                
                # Preprocess cases
                for case in cases:
                    # Ensure all cases have a consistent structure
                    case['description'] = case.get('description', '')
                    case['key_details'] = case.get('key_details', '')
                    case['outcome'] = case.get('outcome', '')
                
                print(f'Dataset loaded: {len(cases)} cases')
                return cases
        except Exception as e:
            print(f"Error loading past cases: {e}")
            return []
    
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
                2. Provide a brief explanation of each applicable clause
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

            # Calculate risk probability based on similar cases
            # similar_cases = self.find_similar_cases(
            #     result.get('case_category', ''), 
            #     result.get('key_details', {})
            # )

            # result["similar_cases"] = similar_cases
            
            # # Add risk assessment
            # risk_assessment = self.calculate_risk_probability(
            #     similar_cases, 
            #     result.get('key_details', {})
            # )
            # result['risk_assessment'] = risk_assessment
            
            return result
        
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