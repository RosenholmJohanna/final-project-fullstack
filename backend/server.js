import express from "express";
import cors from "cors";
import crypto from "crypto"
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

// import user from "./models/userModel"
// import admin from "./models/adminModel"
//import Question from "./models/questionModel"

const User = require('./models/userModel')
const Admin = require('./models/adminModel')
const Question = require('./models/questionModel')

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.set('strictQuery', true); //due warning mongoose 7
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Connected to the Database successfully')
});
mongoose.Promise = Promise;


const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/endpoints", (req, res) => {
    res.send(listEndpoints(app))
  });
  
  //GET ALL USERS
  app.get("/users", async (req, res)=> {
    const users = await User.find({});
    res.status(200).json({success: true, message: "all users", response: users});
  });

// GET USER BY USERNAME
app.get("/users/:username", async (req, res)=> {
  const {username} = req.params
  try {
    const Profile = await User.findOne({username}).exec();
    res.json({
      success: true, 
      username: Profile.username, 
      roles: Profile.roles,
      id: Profile._id,
      collections: Profile.collections
    })
} catch (error) {
  res.status(400).json({success: false, message: 'Can not find user ', error});
}
});

// // USER BY ID: HERE I GET THE ITEMS... but not the rights user, but the first one in list
// app.get("/users/id/:id", async (req, res) => {
//   try {
//     const userById=await User.findOne({user_ID: req.params.user_ID})
//   if(userById) {
//     res.status(200).json({
//       data: userById,
//       success: true,
//     })
//   } else {
//     res.status(404).json({
//       error: 'No user with that user ID was found.',
//       success: false,
//     })
//   }
//   } catch (err) {
//     res.status(400).json({
//       error: 'Invalid user ID',
//       success: false,
//     })
//   }
//   })

//GET USER BY ID - get the right user but not the item
  app.get("/users/id/:_id", async (req, res) => {
    const { _id } = req.params
    
    try {
    if(_id) {
      const userById =await User.findById({_id});
      //const collections = []
      res.status(200).json({
        data: userById,
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'No user with that user ID was found.',
        success: false,
      })
    }
    } catch (err) {
      res.status(400).json({
        error: 'Invalid user ID',
        success: false,
      })
    }
    })


// // DOES NOT WORK - (REGEX)
// // GET USER BY USER _ID
// app.get("/users/:_id", async (req, res)=> {
//     const { _id } = req.params
//     try {
//     if (_id) {
//       const userProfile = await User.findById({_id}).exec();
//       const collection = []
//       for (const question of userProfile.collections) {
//         const questionObject = await Question.findById(question)
//         collections.push(questionObject)
//       }
//     }
//       res.json({
//         success: true, 
//         username: userProfile.username, 
//         roles: userProfile.roles,
//         id: userProfile._id,
//         collections: userProfile.collections
//       })
//   } catch (error) {
//     res.status(404).json({
//         success: false,
//         message: 'Can not find ',
//         error});
//   }
//   });

// DELETE QUESTION BY USER(ID) OR ADMIN
// app.delete('/users/:_id', authenticateUser, authenticateAdmin)
// app.delete('/users/:_id', async (req, res) => {
//   const { _id } = req.params
// })



// USER REGISTRATION ENDPOINT ( this sent to the browser what we get)
app.post("/register", async (req, res) => {
  const { username, password, roles } = req.body;
  try {
    const salt = bcrypt.genSaltSync();
    if (password.length < 3) {
      res.status(400).json({
        success: false,
        response: "Password must be at least 3 characters long"
      });
    } else {
      const newUser = await new User({username: username, password: bcrypt.hashSync(password, salt), roles: roles}).save();
      res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          accessToken: newUser.accessToken,
          id: newUser._id,
          roles: newUser.roles
        }
      });
    }
  } catch(error) {
      res.status(400).json({
        success: false,
        response: error
      });
  }
});

// USER LOGIN ENDPOINT
app.post("/login", async (req, res) => {
  const { username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          roles: user.roles,
          accessToken: user.accessToken
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials didn't match"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
});

//// AUTHORIZATION USER
// next = callback function
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({accessToken: accessToken});
    if (user) {
      next();
    } else {
      res.status(401).json({
        response: "Please log in",
        success: false
      })
    }
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false
    })
  }
}

//GET ALL ADMINS - works
app.get("/admins", async (req, res)=> {
  const admins = await Admin.find({});
  res.status(200).json({
    success: true, 
    message: "all admins", 
    response: admins});
});

// ADMIN REGISTRATION ENDPOINT - works
app.post("/registeradmin", async (req, res) => {
  const { adminname, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync();
    if (password.length < 3) {
      res.status(400).json({
        success: false,
        response: "Password must be at least 3 characters long"
      });
    } else {
      const newAdmin = await new Admin ({adminname: adminname, password: bcrypt.hashSync(password, salt)}).save();
      res.status(201).json({
        success: true,
        response: {
          adminname: newAdmin.adminname,
          accessToken: newAdmin.accessToken,
          id: newAdmin._id
        }
      });
    }
  } catch(error) {
      res.status(400).json({
        success: false,
        response: error
      });
  }
});

// //// AUTHORIZATION ADMIN
// // next = callback function
// const authenticateAdmin = async (req, res, next) => {
//   const accessToken = req.header("Authorization");
//   try {
//     const admin = await Admin.findOne({accessToken: accessToken});
//     if (admin) {
//       next();
//     } else {
//       res.status(401).json({
//         response: "Please log in as admin",
//         success: false
//       })
//     }
//   } catch (error) {
//     res.status(400).json({
//       response: error,
//       success: false
//     })
//   }
// }

// GET & POST question: doesnt work with both admin and user at same tine (), but with one each...
// GET ALL QUESTIONS FROM ALL USERS, secure endpoint - must be logge in to see
app.get("/questions",  authenticateUser); ////authenticateAdmin
app.get("/questions", async (req, res)=> {
  const questions = await Question.find({});
  res.status(200).json({
    success: true, 
    response: questions}); 
});

// GET QUESTION by QUESTION ID
app.get("/questions/id/:questionID", async (req, res) => {
  try {
    const questionById=await Question.findOne({questionID: req.params.questionID})
  if(questionById) {
    res.status(200).json({
      data: questionById,
      success: true,
    })
  } else {
    res.status(404).json({
      error: 'No book with that question ID was found.',
      success: false,
    })
  }
  } catch (err) {
    res.status(400).json({
      error: 'Invalid question ID',
      success: false,
    })
  }
  })
  

// // POST NEW QUESTION BY USER
app.post("/questions",  authenticateUser) //authenticateAdmin
app.post("/questions", async (req, res) => {
  const { message, answer } = req.body;
  try {
    const newQuestion = await new Question({message, answer}).save();
    res.status(201).json({success: true, response: newQuestion});
  } catch (error) {
    res.status(400).json({
        success: false, 
        response: error
    });
  }
});

app.get("/", (req, res) => {
  res.send("Final Project backend");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// req body: data sent from client to  my API
// res body: data my API sends to client
//POST ANSWER?  or PUT/PATCH to question??? 

// To Do:
// POST answer by admin
// POST question by user
// PATCH likes by ALL users, NOT admin
// POST/GET COLLECTIONS Save() questions to collections
// DELETE Question by user and admin

