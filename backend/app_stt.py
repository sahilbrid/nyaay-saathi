import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import csv
import sys
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import speech_recognition as sr
import langdetect
import io
import tempfile
import subprocess
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

maxInt = sys.maxsize

while True:
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)


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
        
        # Conversation state
        self.current_case_analysis = None
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

    def process_follow_up_question(self, input_text, previous_case_context):
        """
        Process follow-up questions with context awareness
        
        Args:
            input_text (str): User's follow-up question
            previous_case_context (dict): Context of the previous case analysis
        
        Returns:
            dict: Contextual response or additional analysis
        """
        # Prepare system message with context
        messages = [
            {
                "role": "system", 
                "content": f"""You are an advanced legal AI assistant specializing in providing 
                contextual and detailed legal guidance. The user has a previous case context 
                related to {previous_case_context.get('case_category', 'a legal matter')}.

                PREVIOUS CASE CONTEXT:
                {json.dumps(previous_case_context, indent=2)}

                Your task is to:
                1. Understand the follow-up question
                2. Provide a detailed, context-aware response
                3. Offer specific legal insights
                4. Maintain the professional tone of a legal consultant

                Respond with comprehensive, actionable information."""
            },
            {
                "role": "user", 
                "content": f"Given the previous case context, please provide a detailed response to this follow-up question: {input_text}"
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

    def understand_case(self, input_text, previous_case_context=None):
        """
        Analyze the case details with optional context preservation
        
        Args:
            input_text (str): User-provided case description
            previous_case_context (dict, optional): Context from previous analysis
        
        Returns:
            dict: Comprehensive case understanding
        """
        # If previous context exists and input seems like a follow-up question
        if previous_case_context and self.is_follow_up_question(input_text):
            return self.process_follow_up_question(input_text, previous_case_context)
        
        # Standard case analysis logic (previous implementation)
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
                - Respond professionally and precisely
                - Use Indian legal context
                - Provide actionable guidance
                - Structure response as a comprehensive JSON object
                
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
                }}

                If the user asks any follow up question on the given case or any other law related questions then respond in the following
                JSON format:

                {{
                    "messages": "..."
                }}
                """
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
            
            # Store current case analysis
            self.current_case_analysis = result
            
            return result
        
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def is_follow_up_question(self, input_text):
        """
        Determine if the input is likely a follow-up question
        
        Args:
            input_text (str): User's input text
        
        Returns:
            bool: True if input seems like a follow-up, False otherwise
        """
        follow_up_indicators = [
            'elaborate',
            'explain more',
            'details about',
            'tell me more',
            'further information',
            'additional context',
            'more about',
            'clarify',
            'expand on'
        ]
        
        # Convert input to lowercase for case-insensitive matching
        lower_input = input_text.lower()
        
        # Check if any follow-up indicator is in the input
        return any(indicator in lower_input for indicator in follow_up_indicators)

# Global chatbot instance
chatbot = LegalAnalysisChatbot()

recognizer = sr.Recognizer()

def save_uploaded_file(uploaded_file):
    """
    Safely save uploaded file to a temporary location
    
    Args:
        uploaded_file (FileStorage): Uploaded file from Flask request
    
    Returns:
        str: Path to saved temporary file
    """
    try:
        # Generate a unique temporary filename
        temp_dir = tempfile.gettempdir()
        filename = f"audio_{os.urandom(8).hex()}.webm"
        temp_path = os.path.join(temp_dir, filename)
        
        # Ensure the directory exists and is writable
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the file
        uploaded_file.save(temp_path)
        
        # Verify file was saved
        if not os.path.exists(temp_path):
            raise IOError("Failed to save uploaded file")
        
        return temp_path
    
    except Exception as e:
        print(f"Error saving uploaded file: {e}")
        raise

def convert_audio_to_wav(input_path):
    """
    Convert input audio to WAV format using FFmpeg
    
    Args:
        input_path (str): Path to input audio file
    
    Returns:
        str: Path to converted WAV file
    """
    # Create temporary output file
    temp_dir = tempfile.gettempdir()
    output_filename = f"converted_{os.urandom(8).hex()}.wav"
    output_path = os.path.join(temp_dir, output_filename)
    
    try:
        # Check if FFmpeg is available
        try:
            subprocess.run(['ffmpeg', '-version'], 
                           stdout=subprocess.PIPE, 
                           stderr=subprocess.PIPE, 
                           check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise ValueError("FFmpeg is not installed or not in system PATH")
        
        # Use FFmpeg to convert audio to WAV
        # Ensure consistent audio parameters for speech recognition
        conversion_cmd = [
            'ffmpeg', 
            '-i', input_path,  # Input file
            '-acodec', 'pcm_s16le',  # 16-bit PCM 
            '-ar', '16000',  # 16kHz sample rate
            '-ac', '1',  # Mono channel
            output_path
        ]
        
        # Run conversion with detailed error handling
        result = subprocess.run(
            conversion_cmd, 
            capture_output=True, 
            text=True, 
            check=True
        )
        
        # Verify output file exists
        if not os.path.exists(output_path):
            raise IOError("Audio conversion failed - no output file")
        
        return output_path
    
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg conversion error: {e}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        raise ValueError(f"Could not convert audio: {e}")
    except Exception as e:
        print(f"Unexpected conversion error: {e}")
        raise

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Robust route to handle audio transcription with conversion
    """
    temp_audio_path = None
    converted_audio_path = None
    
    try:
        # Check if audio file is present in the request
        if 'audio' not in request.files:
            return jsonify({
                "status": "error", 
                "message": "No audio file provided"
            }), 400
        
        # Get the audio file
        audio_file = request.files['audio']
        
        # Save uploaded file to a temporary location
        temp_audio_path = save_uploaded_file(audio_file)
        
        try:
            # Convert audio to WAV
            converted_audio_path = convert_audio_to_wav(temp_audio_path)
            
            # Attempt transcription
            with sr.AudioFile(converted_audio_path) as source:
                # Adjust for ambient noise
                recognizer.adjust_for_ambient_noise(source, duration=0.5)
                
                # Record the audio
                audio = recognizer.record(source)
                
                # Try multiple language options
                language_options = ['en-IN', 'hi-IN', 'en-US']
                transcription = None
                
                for lang in language_options:
                    try:
                        transcription = recognizer.recognize_google(audio, language=lang)
                        if transcription and transcription.strip():
                            break
                    except sr.UnknownValueError:
                        continue
                    except sr.RequestError as e:
                        print(f"Request error for {lang}: {e}")
                        break
                
                # Clean up temporary files
                try:
                    if temp_audio_path and os.path.exists(temp_audio_path):
                        os.unlink(temp_audio_path)
                    if converted_audio_path and os.path.exists(converted_audio_path):
                        os.unlink(converted_audio_path)
                except Exception as cleanup_error:
                    print(f"Error during cleanup: {cleanup_error}")
                
                if not transcription:
                    return jsonify({
                        "status": "error",
                        "message": "Could not transcribe audio in any language"
                    }), 400
                
                return jsonify({
                    "status": "success",
                    "transcription": transcription
                })
        
        except Exception as e:
            # Clean up temporary files in case of error
            try:
                if temp_audio_path and os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                if converted_audio_path and os.path.exists(converted_audio_path):
                    os.unlink(converted_audio_path)
            except Exception as cleanup_error:
                print(f"Error during error cleanup: {cleanup_error}")
            
            return jsonify({
                "status": "error", 
                "message": f"Transcription failed: {str(e)}"
            }), 500
    
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": f"Server error: {str(e)}"
        }), 500
    
def transcribe_audio_file(audio_path):
    """
    Attempt transcription using multiple methods
    
    Args:
        audio_path (str): Path to the audio file
    
    Returns:
        str: Transcribed text
    """
    transcription_methods = [
        google_transcription,
        sphinx_transcription
    ]
    
    # Try each transcription method
    for method in transcription_methods:
        try:
            transcription = method(audio_path)
            if transcription and len(transcription.strip()) > 0:
                return transcription
        except Exception as e:
            print(f"Transcription method {method.__name__} failed: {e}")
    
    raise ValueError("All transcription methods failed")

def google_transcription(audio_path):
    """
    Transcribe audio using Google Speech Recognition
    """
    with sr.AudioFile(audio_path) as source:
        # Adjust for ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        
        # Record the audio
        audio = recognizer.record(source)
        
        # Attempt transcription with multiple language options
        language_options = ['en-IN', 'hi-IN', 'en-US']
        
        for lang in language_options:
            try:
                return recognizer.recognize_google(audio, language=lang)
            except sr.UnknownValueError:
                continue
            except sr.RequestError:
                break
    
    raise ValueError("Google transcription failed")

def sphinx_transcription(audio_path):
    """
    Transcribe audio using CMU Sphinx (offline method)
    """
    with sr.AudioFile(audio_path) as source:
        # Adjust for ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        
        # Record the audio
        audio = recognizer.record(source)
        
        return recognizer.recognize_sphinx(audio)

@app.route('/analyze', methods=['POST', 'GET'])
def analyze_case():
    """
    Flask route to analyze legal case description
    """
    try:
        # Get input from request
        data = request.json
        input_text = data.get('case_description', '')
        previous_case_context = data.get('previous_case_context', None)
        
        # Parse previous case context if it's a string
        if isinstance(previous_case_context, str):
            try:
                previous_case_context = json.loads(previous_case_context)
            except json.JSONDecodeError:
                previous_case_context = None
        
        # Validate input
        if not input_text:
            return jsonify({
                "status": "error", 
                "message": "Please provide a case description"
            }), 400
        
        # Analyze the case with optional context
        result = chatbot.understand_case(
            input_text, 
            previous_case_context
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)