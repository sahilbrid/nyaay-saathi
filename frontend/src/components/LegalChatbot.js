import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function LegalChatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Namaste! I'm your legal guidance chatbot. I'm here to provide comprehensive legal analysis and advice. Please describe your legal case, and I'll help you understand it.",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentCaseAnalysis, setCurrentCaseAnalysis] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        setAudioChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setAudioChunks([]);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    
    try {
    // Log blob details
        console.log('Audio Blob:', {
            type: audioBlob.type,
            size: audioBlob.size
        });
  
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout
      });

      if (response.data.status === 'success') {
        const transcription = response.data.transcription.trim();
        
        if (transcription) {
          setInputMessage(transcription);
          sendMessage(transcription);
        } else {
          const errorMessage = {
            text: 'Could not understand the audio. Please try again.',
            sender: 'bot'
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      } else {
        throw new Error(response.data.message || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      
      let errorMessage = 'Sorry, I could not transcribe your audio. Please try again.';
      
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || 
          `Server error: ${error.response.status}. Please try again.`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Transcription timed out. Please try again.';
      }

      const botErrorMessage = {
        text: errorMessage,
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || inputMessage;
    
    if (!messageToSend.trim()) return;

    // Add user message to chat
    const newMessages = [
      ...messages, 
      { text: messageToSend, sender: 'user' }
    ];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare payload with case description or follow-up question
      const payload = {
        case_description: messageToSend,
        previous_case_context: currentCaseAnalysis ? JSON.stringify(currentCaseAnalysis) : null
      };

      const response = await axios.post('http://localhost:5000/analyze', payload);

      // Prepare bot response based on the analysis
      const botResponse = {
        text: formatBotResponse(response.data, messageToSend),
        sender: 'bot'
      };

      setMessages([...newMessages, botResponse]);
      
      // Only update case analysis if it's a new case
      if (!currentCaseAnalysis) {
        setCurrentCaseAnalysis(response.data);
      }
    } catch (error) {
      const errorMessage = {
        text: 'Sorry, I could not process your request. Please try again.',
        sender: 'bot'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBotResponse = (responseData, userInput) => {
    // If it's a new case analysis
    if (responseData.case_category) {
      return `📋 Case Analysis Report 📋

🏷️ Case Category: ${responseData.case_category}

🔍 Key Details:
• Description: ${responseData.key_details?.description}

🚨 Primary Issues:
${responseData.key_details?.primary_issues?.map(issue => `• ${issue}`).join('\n')}

⚖️ Risk Assessment:
• Complexity: ${responseData.preliminary_risk_assessment?.complexity}
• Potential Impact: ${responseData.preliminary_risk_assessment?.potential_impact}

🚀 Recommended Next Steps:
${responseData.recommended_next_steps?.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Case Duration:
• The case will approximately take ${responseData.case_duration}

Would you like me to elaborate on any part of this analysis?`;
    }

    // If it's a follow-up question, create a contextual response
    return formatFollowUpResponse(responseData, userInput);
  };

  const formatFollowUpResponse = (responseData, userInput) => {
    // Lowercase and simplify the input for easier matching
    const simplifiedInput = userInput.toLowerCase().trim();

    // Predefined response patterns for common follow-up questions
    const responsePatterns = {
      'risk assessment': () => `🔍 Risk Assessment Details:
• Complexity: Medium
• Potential Impact: High

Key Risk Factors:
1. Potential workplace discrimination
2. Risk of employer retaliation
3. Financial and career implications

Mitigation Strategies:
• Document all incidents
• Seek legal consultation
• Understand your rights under employment laws

Would you like more specific details about the risks?`,

      'primary issues': () => `🚨 Primary Issues Breakdown:
1. Unpaid Overtime
   • Potential violation of labor laws
   • Impacts fair compensation
   • Demonstrable through work records

2. Gender-based Pay Discrimination
   • Potential breach of equal pay regulations
   • Evidence of pay disparity
   • Violation of workplace equality principles

3. Potential Retaliation
   • Risk of adverse workplace actions
   • Protection under anti-discrimination laws
   • Importance of documenting any retaliatory behavior

Need more information about any of these issues?`,

      'next steps': () => `🚀 Detailed Next Steps:
1. Evidence Collection
   • Gather payslips
   • Collect overtime records
   • Document discriminatory incidents
   • Save communication evidence

2. Legal Consultation
   • Consult employment lawyer
   • Understand your specific legal rights
   • Assess potential legal actions

3. Formal Complaint Filing
   • Prepare comprehensive complaint
   • File with Labour Commissioner
   • Consider internal HR complaint process

4. Workplace Documentation
   • Maintain professional communication
   • Keep detailed personal records
   • Avoid confrontational interactions

Would you like guidance on implementing these steps?`
    };

    // Check for matching response pattern
    for (const [key, responseFunc] of Object.entries(responsePatterns)) {
      if (simplifiedInput.includes(key)) {
        return responseFunc();
      }
    }

    // Default follow-up response
    return `I noticed your follow-up question. Based on our previous case analysis about employment discrimination at TechNova Solutions, I'm ready to provide more detailed insights. 

What specific aspect would you like to explore further?
• Risk Assessment
• Primary Issues
• Recommended Next Steps

Feel free to ask, and I'll provide a comprehensive response.`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar/>
      {/* Header */}
      <div style={{
        backgroundColor: '#805ad5',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>NyaayBot</h2>
        <div>
          {isRecording ? (
            <button 
              onClick={stopRecording}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer'
              }}
            >
              ◼
            </button>
          ) : (
            <button 
              onClick={startRecording}
              style={{
                backgroundColor: 'white',
                color: '#0078ff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer'
              }}
            >
              🎤
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: 'white'
      }}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            style={{
              textAlign: message.sender === 'user' ? 'right' : 'left',
              marginBottom: '10px'
            }}
          >
            <div style={{
              display: 'inline-block',
              backgroundColor: message.sender === 'user' ? '#805ad5' : '#e5e5ea',
              color: message.sender === 'user' ? 'white' : 'black',
              padding: '10px',
              borderRadius: '15px',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            textAlign: 'left',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#e5e5ea',
              padding: '10px',
              borderRadius: '15px'
            }}>
              Analyzing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        display: 'flex',
        padding: '15px',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0'
      }}>
        <textarea 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your legal case or ask a follow-up question..."
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            marginRight: '10px',
            resize: 'none'
          }}
          rows={3}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading}
          style={{
            backgroundColor: '#805ad5',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default LegalChatbot;