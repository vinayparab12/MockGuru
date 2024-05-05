import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./interviewresult.css";

const InterviewResults = () => {
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState([]);
  const [grammarMistakes, setGrammarMistakes] = useState({});
  const [modelAnswers, setModelAnswers] = useState([]);
  const [mostSimilarAnswers, setMostSimilarAnswers] = useState([]);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [fillerWordsCount, setFillerWordsCount] = useState({});
  const [totalFillerWordCount, setTotalFillerWordCount] = useState(0);

  useEffect(() => {
    // Fetch model answers from backend API
    axios
      .get("/model-answers")
      .then((response) => {
        setModelAnswers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching model answers:", error);
      });
  }, []);

  useEffect(() => {
    // Calculate most similar model answers when model answers are available
    if (modelAnswers.length > 0) {
      const answers = [
        { answer: localStorage.getItem("answer1") || "", type: "What is ER model ?" },
        { answer: localStorage.getItem("answer2") || "", type: "Define RDBMS." },
        { answer: localStorage.getItem("answer3") || "", type: "Explain Distributed database." },
      ];
      setUserAnswers(answers);
  
      const newMostSimilarAnswers = [];
      let totalAccuracy = 0;
      const detectedFillers = {};
      let totalFillerCount = 0;
  
      answers.forEach((userAnswer) => {
        const { answer, type } = userAnswer;
        const cleanedUserAnswer = cleanText(answer);
        const userAnswerWords = tokenizeText(cleanedUserAnswer);
        const userStopWordsRemoved = removeStopWords(userAnswerWords, getStopWords());
  
        let maxSimilarityPercentage = 0;
        let mostSimilarModelAnswer = "";
        let detectedFillersInAnswer = [];
        let keywordMatched = false;
        
        modelAnswers.forEach((modelAnswer) => {
          for (let i = 1; i <= 100; i++) {
            const modelAnswerText = modelAnswer[`ans${i}`];
            const cleanedModelAnswer = cleanText(modelAnswerText);
            const modelAnswerWords = tokenizeText(cleanedModelAnswer);
            const modelStopWordsRemoved = removeStopWords(modelAnswerWords, getStopWords());
  
            const matchingWords = userStopWordsRemoved.filter((word) => modelStopWordsRemoved.includes(word));
            const baseSimilarityPercentage = (matchingWords.length / modelStopWordsRemoved.length) * 100;
            let similarityPercentage = baseSimilarityPercentage;
  
            const userAnswerLength = userAnswerWords.length;
            if (userAnswerLength < 10) {
              similarityPercentage *= 0.1;
            } else if (userAnswerLength < 15) {
              similarityPercentage *= 0.75;
            }
  
            if (modelAnswerText.toLowerCase().includes(userAnswer.type.toLowerCase())) {
              keywordMatched = true;
            }
  
            if (keywordMatched) {
              // Apply penalty if keyword is not matched
              if (!matchingWords.length) {
                similarityPercentage *= 0.5; // Penalty for not matching keyword
              }
            }
  
            if (similarityPercentage > maxSimilarityPercentage) {
              maxSimilarityPercentage = similarityPercentage;
              mostSimilarModelAnswer = modelAnswerText;
              detectedFillersInAnswer = detectFillerWords(answer, getFillerWords());
            }
          }
        });
  
        newMostSimilarAnswers.push({
          userAnswerType: type,
          userAnswerText: answer,
          modelAnswerType: type,
          mostSimilarModelAnswer: mostSimilarModelAnswer,
          similarity: maxSimilarityPercentage.toFixed(2),
          detectedFillers: detectedFillersInAnswer.join(", "),
        });
  
        totalAccuracy += maxSimilarityPercentage;
        detectedFillersInAnswer.forEach((filler) => {
          if (filler in detectedFillers) {
            detectedFillers[filler]++;
          } else {
            detectedFillers[filler] = 1;
          }
          totalFillerCount++;
        });
      });
  
      setMostSimilarAnswers(newMostSimilarAnswers);
      setAverageAccuracy((totalAccuracy / answers.length).toFixed(2));
      setFillerWordsCount(detectedFillers);
      setTotalFillerWordCount(totalFillerCount);
    }
  }, [modelAnswers]);
  
  
  

  useEffect(() => {
    // Function to check grammar mistakes using LanguageTool API
    const checkGrammar = async () => {
      const mistakes = {};

      for (const answer of userAnswers) {
        try {
          const response = await axios.post(
            "https://languagetool.org/api/v2/check",
            `text=${encodeURIComponent(answer.answer)}&language=en-US`
          );

          mistakes[answer.type] = response.data.matches;
        } catch (error) {
          console.error(`Error checking grammar for ${answer.type}:`, error);
        }
      }

      setGrammarMistakes(mistakes);
    };

    if (userAnswers.length > 0) {
      checkGrammar();
    }
  }, [userAnswers]);

  const cleanText = (text) => {
    return text.trim().toLowerCase().replace(/[^a-zA-Z ]/g, "");
  };

  const tokenizeText = (text) => {
    return text.split(/\s+/).filter((token) => token.trim() !== "");
  };

  const getRandomModelAnswer = (modelAnswer) => {
    const randomIndex = Math.floor(Math.random() * 100) + 1; // Generate random index from 1 to 100
    const propName = `ans${randomIndex}`;
    return modelAnswer[propName];
  };

  const detectFillerWords = (paragraph, fillerWords) => {
    const words = paragraph.toLowerCase().match(/\b\w+\b/g) || [];
    return words.filter((word) => fillerWords.includes(word));
  };

  const getStopWords = () => {
    return new Set([
      "about", "above", "across", "after", "again", "against", "almost", "alone", "along", "already",
  "also", "although", "always", "among", "an", "and", "another", "any", "anybody", "anyone",
  "anything", "anywhere", "are", "around", "a","as", "at", "back", "be", "because", "been",
  "before", "being", "below", "between", "both", "but", "by", "can", "could", "did",
  "do", "does", "doing", "done", "down", "during", "each", "either", "else", "ever",
  "every", "everyone", "everything", "everywhere", "except", "few", "first", "for", "from",
  "get", "go", "had", "has", "have", "he", "her", "here", "hers", "herself", "him",
  "himself", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its",
  "itself", "just", "last", "like", "many", "may", "me", "might", "more", "most", "much",
  "must", "my", "myself", "near", "never", "next", "no", "nobody", "none", "nor", "not",
  "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "or",
  "other", "others", "ought", "our", "ours", "ourselves", "out", "over", "own", "perhaps", "please",
  "previous", "quite", "rather", "really", "right", "said", "same", "she", "should", "since", "so",
  "some", "somebody", "someone", "something", "somewhere", "still", "such", "than", "that", "the", "their",
  "theirs", "them", "themselves", "then", "there", "therefore", "these", "they", "this", "those", "though",
  "three", "through", "throughout", "thus", "to", "together", "too", "toward", "under", "until", "up",
  "upon", "us", "very", "was", "we", "well", "were", "what", "whatever", "when", "where", "wherever",
  "whether", "which", "while", "who", "whom", "whose", "why", "will", "with", "within", "without",
  "would", "yet", "you", "your", "yours", "yourself", "yourselves"
      // Add more stop words as needed
    ]);
  };

  const getFillerWords = () => {
    // #Tharak
    return ["uh", "uhh", "uhhh", "um", "umm", "hmm", "hm", "oh", "ohh", "ohhh", "ah", "ahh", "ahhh"];
  };

  const removeStopWords = (tokens, stopWords) => {
    return tokens.filter((token) => !stopWords.has(token.toLowerCase()));
  };

  const redirectToFeedbackPage = () => {
    const feedbackData = {
      averageAccuracy,
      fillerWordsCount,
      modelAnswers,
      grammarMistakes,
    };

    localStorage.setItem("feedbackData", JSON.stringify(feedbackData));
    navigate("/dashboard/interview-result/feedback");
  };

  return (
    <div className="interview-results resultbgchange">
      <h2>RESULTS</h2>
      {mostSimilarAnswers.map((answer, index) => (
        <div key={index} className="answer-container">
          <h5>Question: {answer.userAnswerType}</h5>
          <p className="answeruser">User Answer:</p>
          <p>{answer.userAnswerText}</p>
          <p className="answeruser">Accuracy: {answer.similarity}%</p>
          <p className="answeruser">Detected Filler Words: {answer.detectedFillers}</p>
          <p className="answeruser">Sample Model Answer:</p>
          <p >{answer.mostSimilarModelAnswer}</p>
          {grammarMistakes[answer.userAnswerType] && (
            <div>
              <p className="answeruser">Grammar Mistakes:</p>
              <ul>
                {grammarMistakes[answer.userAnswerType].map((mistake, idx) => (
                  <li key={idx}>{mistake.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      <div className="summary">
        <h3>RESULT</h3>
        <p>Average Accuracy: {averageAccuracy}%</p>
        <p>Total Filler Words: {totalFillerWordCount}</p>
        <button onClick={redirectToFeedbackPage}>Final Result</button>
      </div>
    </div>
  );
};

export default InterviewResults;