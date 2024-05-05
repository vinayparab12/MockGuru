import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BackendInterview.css"; // Import your CSS file



const QuestionList = ({ questions, onQuestionClick }) => {
  return (
    <div className="question-list">
      <h2>Questions</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id} onClick={() => onQuestionClick(question.id)}>
            Question {question.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

const BackendInterview = () => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [speechToText, setSpeechToText] = useState("");
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] =
    useState(false);
  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
  });

  const questions = [
    { id: 1, content: "What is ER Model?" },
    { id: 2, content: "Explain RDBMS" },
    { id: 3, content: "What is a Distributed Database?" },
  ];
  const [completedQuestions, setCompletedQuestions] = useState({
    1: false,
    2: false,
    3: false,
  });
  useEffect(() => {
    let recognition;

    if (isSpeechRecognitionActive) {
      // Initialize speech recognition when the component mounts or when isSpeechRecognitionActive changes to true
      recognition = new window.webkitSpeechRecognition(); // Use the appropriate vendor prefix
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");

        setSpeechToText(transcript);          
      };

      // Handle errors
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsSpeechRecognitionActive(false); // Stop speech recognition on error
      };

      // Start speech recognition
      recognition.start();
    } else {
      if (recognition) {
        // Stop speech recognition when isSpeechRecognitionActive changes to false
        recognition.stop();
      }
    }

    // Clean up when the component unmounts or when isSpeechRecognitionActive changes to false
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [selectedQuestion, isSpeechRecognitionActive]); // Trigger speech recognition when the selected question changes or isSpeechRecognitionActive changes


  const handleQuestionClick = (questionId) => {
    if (questionId === selectedQuestion + 1) {
      setSelectedQuestion(questionId);
      setSpeechToText("");
    }
  };

  const handleNextPage = () => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [selectedQuestion]: speechToText,
    }));
  
    setCompletedQuestions((prevCompleted) => ({
      ...prevCompleted,
      [selectedQuestion]: true,
    }));
  
    if (selectedQuestion < questions.length) {
      setSelectedQuestion(selectedQuestion + 1);
      setSpeechToText("");
    }
  };

  const handleStartSpeechRecognition = () => {
    setIsSpeechRecognitionActive(true);
  };

  const handleStopSpeechRecognition = () => {
    setIsSpeechRecognitionActive(false);
  };

  const handleTextareaChange = (e) => {
    setSpeechToText(e.target.value);
  };

  const handleSubmitInterview = async () => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to submit the interview?"
      );

      if (isConfirmed) {
        if (answers[1] && answers[2] && answers[3]) {
          // Store answers in localStorage
          localStorage.setItem('answer1', answers[1]);
          localStorage.setItem('answer2', answers[2]);
          localStorage.setItem('answer3', answers[3]);

          // Iterate through each question to make fetch requests (similar to your existing code)
          for (let i = 1; i <= questions.length; i++) {
            const answer = answers[i];
            const response = await fetch('/store-answer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                questionId: i,
                answer: answer 
              }),
            });

            if (!response.ok) {
              console.error(`Error storing answer for question ${i}:`, response.statusText);
              break;
            }
          }

          // After all answers have been successfully stored, navigate to the dashboard
          navigate('/dashboard');
        } else {
          window.alert("Please complete all questions before submitting the interview.");
        }
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
    }
  };
  
  const allQuestionsCompleted =
  completedQuestions[1] && completedQuestions[2] && completedQuestions[3];

  return (
    <div className="frontend-interview-container form-container">
      <QuestionList questions={questions} onQuestionClick={handleQuestionClick} />
      <div className="main-content form-box">
        <h1 className="form-title">Data Analyst Test</h1>
        <div>
          <h2 className="question">Question {selectedQuestion}</h2>
          <p classname="mainquestion">{questions.find((q) => q.id === selectedQuestion)?.content}</p>
          <textarea
            className="field-interview"
            value={speechToText}
            onChange={handleTextareaChange}
            placeholder="Speech-to-Text Output"
            style={{

            }}
          />
          <button className=" button" onClick={handleStartSpeechRecognition}>
            Start Speech
          </button>
          <button className=" button" onClick={handleStopSpeechRecognition}>
            Stop Speech
          </button>
          {selectedQuestion <= questions.length && (
            <button className="form-group button" onClick={handleNextPage}>
              Submit Answer
            </button>
          )}
          {allQuestionsCompleted && (
            <button className="form-group button" onClick={handleSubmitInterview}>
              Submit Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendInterview;
