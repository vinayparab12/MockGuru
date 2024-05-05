const dotenv = require('dotenv'); // To secure imp info 
const mongoose = require('mongoose');
const express = require('express');  // Express initialization for frontend
const app = express();
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config.env' });

// In .gitignore , if we upload the code on the github then the important information get ignored by the another user

app.use(cookieParser());
require('./db/conn'); // path of conn.js
//const User = require('./model/userSchema'); // path of userSchema.js
//const UserAnswer = require('./model/userAnswerSchema'); // path of userAnswerSchema.js

app.use(express.json()); // express helps to show the jason data on postman

// We link ths router file to make our route easy
app.use(require('./Router/auth')); // this call first


const PORT = process.env.PORT 
// Middleware : It helps to allow on the next page

app.get('/about',(req,res)=>{    // about page 
    // res.cookie("Test","Vinay"); // cookie is hown on browser(i)
    console.log("Hello about after middleware")
    res.send('ABOUT');
})

app.get('/contact',(req,res)=>{    //contact page 
    res.send('CONTACT');
})

app.get('/login',(req,res)=>{    //login page 
    // res.cookie("Test","Vinay");
    res.send('LOGIN');
})

app.get('/registration',(req,res)=>{    //registration page 
    res.send('REGISTRATION');
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


app.listen(PORT,()=>{    // listen from express
    console.log(`Server is running on port number ${PORT}`) // server is running on PORT which is assigned in config.env file
}) // Now type 'localhost:3000' on browser then server will be start 


