// App.js
import React, { createContext, useReducer } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
// import ContactUs from './components/ContactUs';
import Registration from './components/Registration';
import Login from './components/Login';
import Errorpage from './components/Errorpage';
import { Routes, Route } from 'react-router-dom';
import "./App.css";
import GetStarted from './components/GetStarted';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard'
import {initialState,reducer} from '../src/reducer/UseReducer';
import BackendInterview from './components/BackendInterview';
import InterviewResult from './components/InterviewResult';
import Feedback from './components/feedback';

// ContextAPI: Define UserContext outside of the component
export const UserContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* <Route path="/contact" element={<ContactUs />} /> */}
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/getstarted" element={<GetStarted />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/interview-result" element={<InterviewResult />} />
      <Route path="*" element={<Errorpage />} />
      <Route path="/getstarted/backendInterview" element={<BackendInterview />} />
      <Route path="/dashboard/interview-result/feedback" element={<Feedback />} />
      

    </Routes>
  );
};

const App = () => {

  const [state,dispatch] = useReducer(reducer,initialState)
  
  return (
    <>
      {/* Use the UserContext.Provider to wrap your application */}
      <UserContext.Provider value={{state,dispatch}}>
        <Navbar />
        <Routing />
      </UserContext.Provider>
    </>
  );
};

export default App;
