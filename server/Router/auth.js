const jwt = require("jsonwebtoken");
const express = require("express"); // express for backend
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate")
const router = express.Router();

require("../db/conn"); //mongodb connection required because the data is stored from this js file

const User = require("../model/userSchema"); // User schema also required to get the name, email,phone_no etc
const UserAnswer = require("../model/userAnswerSchema"); // Import the new schema for user answers
const ModelAnswer = require("../model/modelansSchema"); // Import the new schema for user answers


router.get("/", (req, res) => {
  // FAT arrow function and get from express
  res.send("Hello World from the server router js !");
});

// This will be stored at the database : (Using Await Sync version)
router.post("/register", async (req, res) => {
  const { name, email, phone_no, password, cpassword } = req.body;

  if (!name || !email || !phone_no || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill in all the fields properly" });
  }

  try {
    const userExistEmail = await User.findOne({ email: email });
    const userExistPhone = await User.findOne({ phone_no: phone_no });

    if (userExistEmail) {
      return res.status(422).json({ error: "Email already exists" });
    }

    if (userExistPhone) {
      return res.status(422).json({ error: "Phone number already exists" });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "Password and Confirm Password do not match" });
    }

    const user = new User({ name, email, phone_no, password, cpassword });

    // Hashing the password: Pre-save method; this will call from userSchema
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST : helps to pass the data from frontend to backend
// GET : helps to get the data from backend to the frontend

// Login route :
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Invalid credentials !!" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials !!" });
    }

    const userPass = await bcrypt.compare(password, user.password);

    if (!userPass) {
      return res.status(400).json({ error: "Invalid credentials !!" });
    }

    // JWT authentication :
    let token = await user.generateAuthToken();
    console.log(token);

    res.cookie('jwtoken', token, {
      expires: new Date(Date.now() + 2592000000),
      httpOnly: true,
    });

    res.status(200).json({ message: "User login successfully !!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/getstarted', authenticate, (req, res) => {
  if (!req.cookies || !req.cookies.jwtoken) {
    return res.status(401).send('Unauthorized: No token provided!');
  }

  console.log('Hello GetStarted after middleware');
  res.send(req.rootUser);
});

// LogOut : 
router.get('/logout', (req, res) => {
  console.log('Hello my LogOut');
  
  if (!req.cookies || !req.cookies.jwtoken) {
    res.status(401).json({ error: 'Login first' });
  } else {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).json({ message: 'User LogOut Successfully' });
  }
});

router.get('/dashboard', authenticate, (req, res) => {
  if (!req.cookies || !req.cookies.jwtoken) {
    return res.status(401).send('Unauthorized: No token provided!');
  }

  console.log('Hello Dashboard after middleware');
  res.send(req.rootUser);
});

// Delete Account route:
router.get('/delete-account', authenticate, async (req, res) => {
  try {
    // Assuming req.userID contains the user ID
    const deletedUser = await User.findByIdAndDelete(req.userID);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (req.cookies || req.cookies.jwtoken) {
      res.clearCookie('jwtoken', { path: '/' });
    } 
    res.json({ message: 'Account deleted successfully' });

    
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/dashboard/interview-result', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userID);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const interviewResults = {
        attemptedQuestions: user.attemptedQuestions,
        // Add more data as needed
    };

    res.json(interviewResults);
} catch (error) {
    console.error('Error fetching interview results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

router.post('/store-answer', authenticate, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(400).json({ error: "Valid user is required" });
    }

    if (!questionId || !answer) {
      return res.status(400).json({ error: "Question ID and answer are required" });
    }

    // Increment interview attempt for the user if the current number of answers is a multiple of three
    if (user.answersAttempts % 3 >= 0) {
      user.answersAttempts++;
    }

    // Create a new instance of UserAnswer model
    const userAnswer = new UserAnswer({
      userId: req.userID,
      interview:{
        questionId: questionId,
      answer: answer,
      interviewAttempt: Math.ceil(user.answersAttempts / 3) // Calculate the interview attempt number based on the logic
},
      questionId: questionId,
      answer: answer,
      interviewAttempt: Math.ceil(user.answersAttempts / 3) // Calculate the interview attempt number based on the logic
    });

    // Save the user answer to the database
    await userAnswer.save();

    // Increment interview attempts in the user document
    await user.save();

    res.status(201).json({ message: "User answer stored successfully" });
  } catch (error) {
    console.error('Error storing user answer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all model answers
router.get('/model-answers', async (req, res) => {
  try {
    const modelAnswers = await ModelAnswer.find();
    res.json(modelAnswers);
  } catch (error) {
    console.error('Error fetching model answers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
