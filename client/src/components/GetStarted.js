import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GetStarted.css'; // Import the CSS file
import icons from "../images/select.png";
// import "../App.css"; 


const GetStarted = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedField, setSelectedField] = useState('');

  const callGetStarted = async () => {
    try {
      const res = await fetch('/getstarted', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      console.log(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
      navigate('/login');
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
  };

  const startInterview = async () => {
    try {
      if (!selectedOption || (selectedOption === 'field' && !selectedField)) {
        // Validate that both options are selected
        console.error('Please select both options');
        return;
      }

      const category = selectedOption === 'field' ? selectedField : selectedOption;

      // Use navigate to dynamically generate the path based on the user's choice
      navigate(`/getstarted/${category}Interview`);

    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  useEffect(() => {
    callGetStarted();
  }, []);

  return (
    <div className="get-started-container Home-page">
      <div className='leftsection'>
        <form className="get-started-form " method="GET">
          <div className="webpage ">
            <h1>Mock Interview !</h1>
            <p>Choose Field</p>
            <label htmlFor="option">Select Question Type:</label>
            <select id="option" name="option" onChange={handleOptionChange} value={selectedOption}>
              <option value="">Select an option</option>
              <option value="field">Field-related questions</option>
            </select>
            {selectedOption === 'field' && (
              <div>
                <label htmlFor="field">Select Field:</label>
                <select id="field" name="field" onChange={handleFieldChange} value={selectedField}>
                  <option value="">Select a field</option>
                  <option value="backend">Data analyst</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            )}
            <br />
            <button
              className="start-interview-button"
              type="button"
              onClick={startInterview}
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
      <div >
        <img
          src={icons}
          alt="registration"
          className="img-fluid selectimg"
        />
      </div>
    </div>
  );
};

export default GetStarted;
