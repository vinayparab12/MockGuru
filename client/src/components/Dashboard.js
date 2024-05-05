// Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import icons from "../images/Dashboard.png";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    axios.get('/dashboard')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleDeleteAccount = () => {
    // Show a confirmation alert
    const isConfirmed = window.confirm('Are you sure you want to delete your account?');

    if (isConfirmed) {
      // Call the backend to delete the account
      axios.get('/delete-account')
        .then(response => {
          console.log(response.data);
          // Show an alert after successful deletion
          window.alert('Account deleted successfully.');
          // Redirect to the login page
          navigate('/login');
        })
        .catch(error => {
          console.error('Error deleting account:', error);
          // Handle error scenarios if needed
        });
    }
  };

  const handleViewInterview = () => {
    // Redirect to the InterviewResult page when the "View Interview" button is clicked
    navigate('/dashboard/interview-result');
  };

  return (
    <div className="Home-page dashboard-main">
      <div className='changedirection'>
        <div className="dashboard-container">
          {userData && (
            <div className="profile-info">
              <h2>Profile Information</h2>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone Number:</strong> {userData.phone_no}</p>
              <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
          )}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Interviews</h3>
              <p>Manage your interview schedules and results.</p>
              <button onClick={handleViewInterview}>View Interviews</button>
            </div>
          </div>
        </div>
        <div className='imgDiv'>
          <img
            src={icons}
            alt="registration"
            className="dashboardimg"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;