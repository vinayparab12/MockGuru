import React, { useState, useEffect } from "react";
import "./interviewresult.css";

const FeedbackPage = () => {
  const [averageAccuracy, setAverageAccuracy] = useState(null);
  const [fillerWordsCount, setFillerWordsCount] = useState(null);
  const [performanceStatus, setPerformanceStatus] = useState(null);

  useEffect(() => {
    // Retrieve feedback data from localStorage
    const storedData = localStorage.getItem("feedbackData");
    console.log(storedData)
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const { averageAccuracy: initialAccuracy, fillerWordsCount: detectedFillers } = parsedData;

      // Calculate adjusted accuracy based on detected filler words
      let adjustedAccuracy = initialAccuracy || 0; // Default to 0 if initialAccuracy is not available

      if (detectedFillers && Object.keys(detectedFillers).length > 0) {
        const totalFillerCount = Object.values(detectedFillers).reduce((acc, curr) => acc + curr, 0);
        const reductionFactor = totalFillerCount * 0.005; // Calculate reduction factor based on filler words count

        // Adjust accuracy by reducing it with the calculated reductionFactor
        adjustedAccuracy -= initialAccuracy * reductionFactor;
      }

      // Determine performance status based on accuracy
      if (!isNaN(adjustedAccuracy)) {
        const formattedAccuracy = parseFloat(adjustedAccuracy).toFixed(2); // Format adjusted accuracy to 2 decimal places
        setAverageAccuracy(formattedAccuracy);

        if (adjustedAccuracy >= 90 && adjustedAccuracy < 100) {
          setPerformanceStatus("Excellent! Your demonstrated excellent knowledge and understanding of the topics covered. Responses were highly accurate and comprehensive.");
        } else if (adjustedAccuracy >= 80 && adjustedAccuracy < 90) {
          setPerformanceStatus("Best! The interviewee performed exceptionally well, exhibiting strong competence in most areas. Responses were detailed and well-structured.");
        } else if (adjustedAccuracy >= 70 && adjustedAccuracy <= 80) {
          setPerformanceStatus("Good! Your performance was good, with a solid grasp of the subject matter. Responses were generally accurate and demonstrated understanding.");
        } else if (adjustedAccuracy >= 60 && adjustedAccuracy <= 70) {
          setPerformanceStatus("Satisfactory! Your performance was satisfactory, showing an adequate level of understanding. Responses were somewhat accurate but lacked depth in certain areas.");
        } else if (adjustedAccuracy >= 50 && adjustedAccuracy <= 60) {
          setPerformanceStatus("Fair! Your performance was fair, indicating some understanding of the topics. Responses were somewhat accurate but lacked clarity and detail.");
        } else if (adjustedAccuracy >= 40 && adjustedAccuracy <= 50) {
          setPerformanceStatus("Need Improvement! Your performance indicates a need for improvement. Responses were below the expected level of accuracy and understanding.");
        } else if (adjustedAccuracy >= 30 && adjustedAccuracy <= 40) {
          setPerformanceStatus("Poor! Your performance was poor, reflecting a limited grasp of the topics. Responses were often inaccurate or incomplete.");
        } else if (adjustedAccuracy >= 20 && adjustedAccuracy <= 30) {
          setPerformanceStatus("Very Poor! Your performance was very poor, indicating significant gaps in knowledge and understanding. Responses were largely incorrect or insufficient.");
        } else if (adjustedAccuracy >= 10 && adjustedAccuracy <= 20) {
          setPerformanceStatus("Extremely Poor! Your performance was extremely poor, with minimal understanding of the topics. Responses were consistently inaccurate or inadequate.");
        } else {
          setPerformanceStatus("Critical Improvement Needed! Your performance requires critical improvement. There was a fundamental lack of understanding demonstrated in responses.");
        }

        // Determine feedback based on filler word count
        const fillerWordCount = Object.values(detectedFillers).reduce((acc, curr) => acc + curr, 0);

        if (fillerWordCount >= 0 && fillerWordCount <= 5) {
          setPerformanceStatus(prevStatus => prevStatus + " You used minimal filler words. Excellent job!");
        } else if (fillerWordCount > 5 && fillerWordCount <= 10) {
          setPerformanceStatus(prevStatus => prevStatus + " Your use of filler words is moderate. Keep improving!");
        } else if (fillerWordCount > 10 && fillerWordCount <= 15) {
          setPerformanceStatus(prevStatus => prevStatus + " Your use of filler words is noticeable. Focus on reducing them.");
        } else {
          setPerformanceStatus(prevStatus => prevStatus + " Your use of filler words is quite high. Consider practicing more.");
        }
      }

      setFillerWordsCount(detectedFillers);
    }
  }, []);

  // List of interview preparation websites
  const preparationWebsites = [
    { name: "LeetCode", url: "https://leetcode.com/" },
    { name: "HackerRank", url: "https://www.hackerrank.com/" },
    { name: "Interviewing.io", url: "https://interviewing.io/" },
    { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
    { name: "Coderbyte", url: "https://coderbyte.com/" }
  ];

  return (
    <div className="interview-results">
      <h2>Interview Feedback</h2>
      {averageAccuracy !== null && fillerWordsCount !== null ? (
        <>
        <div className="answer-container">
          <p>
            <p className="answeruser">Detected Filler Words :{" "}</p>
            {Object.entries(fillerWordsCount).length > 0 ? (
              <>
                {Object.entries(fillerWordsCount).map(([fillerWord, count], index) => (
                  <React.Fragment key={fillerWord}>
                    {index > 0 && ", "} {/* Add comma separator if not the first word */}
                    {`${fillerWord}: ${count}`}
                  </React.Fragment>
                ))}
                <br />
                <br />
                <p className="answeruser">Total Filler Words:{" "}</p>
                {Object.values(fillerWordsCount).reduce((acc, curr) => acc + curr, 0)}
              </>
            ) : (
              <span className="answeruser">No filler words detected.</span>
            )}
          </p>
          <><p className="answeruser">Performance Status:</p>{performanceStatus}</><br/><br />
          <p className="answeruser">Total Accuracy: {averageAccuracy}%</p>
          <p>
            For interview preparation, consider exploring these websites:
            <ul>
              {preparationWebsites.map((site) => (
                <li key={site.name}>
                  <a href={site.url} target="_blank" rel="noopener noreferrer">
                    {site.name}
                  </a>
                </li>
              ))}
            </ul>
          </p>
          </div>
        </>
      ) : (
        <p className="no-data">No feedback data available.</p>
      )}
    </div>
  );
};

export default FeedbackPage;