import React, { useState } from 'react';
import "../App.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your contact form submission logic here
    console.log('Contact form data submitted:', formData);
    // Reset the form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
      <section className="contact-us Home-page  splitbg">
        <div className="container ">
          <h2>Contact Us</h2>
          <div className="contact-info-boxes">
            <div className="contact-info-box">
              <span className="box-icon">📞</span>
              <span className="contact-info">&nbsp;Phone Number : 7588905160</span>
            </div>
            <div className="contact-info-box">
              <span className="box-icon">✉️</span>
              <span className="contact-info">&nbsp;Email : vinayparab2001@gmail.com</span>
            </div>
            <div className="contact-info-box">
              <span className="box-icon">📍</span>
              <span className="contact-info">&nbsp;Address : Andheri (E) , Mumbai</span>
            </div>

          </div>

          <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject:</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message:</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ color: 'black' }}
                >
                  Submit
                </button>
              </form>



        </div>
      </section>
    </>
  );
};

export default ContactUs;
