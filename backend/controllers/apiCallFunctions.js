/* -------------------------------------------- Importing All the Required Dependencies -------------------------------------------------------- */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Questions } from "../models/question.js";
import { v4 } from 'uuid';

/* ------------------------------------------- Api Functions ------------------------------------------------------------------------------------ */

export const register = async (req, res) => {                           // api functions that creates new user

    const {  username, email, password, cpassword } = req.body;         // taking given parameters the user must have input

    const user  = await User.findOne({ email });  // checking if user email id is previously registered or not from line 13-18 if not then responding with status 404 and a msg
     
    if (user) return res.status(404).json({
      success: false,
      message: "User already exists",
    })

    const hashesPassword = await bcrypt.hash(password, 10);             // encrypting user password
    const unique_id = v4();                                             // creating a unique id for every user

    if (password === cpassword) {
        user = await User.create({ id:unique_id, username, email, password: hashesPassword });     // checking if user entered password correctly both times or not and updating in database
    }
    else {
      return res.status(404).json({
        success: false,                                 // if user didn't wrote correctly password both times than responding with status 404 and a msg
        message: "Password doesn't match",
      })
    }

    sendCookie(user, res, "Registered Successfully", 0, 201);   // if registration is successfully done creating a session cookie

  };
  
export const createQuestion =async(req,res) =>{       // api to create question
  const {question,creator_id} = req.body;

  const qid = "Q-"+v4();

  const checkID = await User.findOne({ creator_id });

  if (checkID){                                                                 // checking if creator is registered user or not
    const createdQuestion = await Questions.create({ id:qid, question, creator_id });// if creator is valid user then adding question to database
  }
  else{
    return res.status(404).json({
      success: false,                                
      message: "Creator not a registered user",
    })
  }

  return res.status(200).json({
    success: true,                                
    message: "Question added successfully!!",
  })
}  