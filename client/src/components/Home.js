import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import myimg from "../images/xyz.png"

const Home = () => {
  useEffect(() => {
    localStorage.setItem('currentPage', 'home');
  }, []);
  return (
    <>
      <div className='Home-page ' style={{ backgroundColor: 'white', color: 'black' }}>
        <div className='leftsection'>
          <div className='home-info'>
            <h1>Welcome to MockGuru</h1>
            <p>Improve your Interview Performance</p>
          </div>
          <Link to="/getstarted">
            <button className='start-interview-btn'>Start Interview</button>
          </Link>
        </div>
        <div className='rightsection'>
          <img src={myimg} alt='Slider' class="sliderimg" />
        </div>
      </div>
    </>
  );
};

export default Home;
