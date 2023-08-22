/* -------------------------------------------- Importing All the Required Dependencies -------------------------------------------------------- */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Questions } from "../models/question.js";
import { v4 } from 'uuid';
import { sendCookie } from "../utils/feature.js";

/* ------------------------------------------- Api Functions ------------------------------------------------------------------------------------ */

// -------------------- api functions that creates new user

export const register = async (req, res) => {                           

    const {  username, email, password, cpassword } = req.body;         // taking given parameters the user must have input

    let user  = await User.findOne({ email });  // checking if user email id is previously registered or not from line 13-18 if not then responding with status 404 and a msg
     
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

    sendCookie(user, res, "Registered Successfully", 201);   // if registration is successfully done creating a session cookie

  };




//--------------------------- api to create question
  
export const createQuestion =async(req,res) =>{       
  const {question,id} = req.body;

  const qid = "Q-"+v4();
  const checkID = await User.findOne({id });

  if (checkID){                                                                 // checking if creator is registered user or not
    await Questions.create({ qid:qid, question, creator_id:id });// if creator is valid user then adding question to database
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




// --------------------- api function that updates question

export const updateQuestion =async(req,res) =>{  
  const {qid,id,newQuestion} = req.body; // taking question_id , user_id (id of user who wants to update question), the new question which one wants to update

  const questionData = await Questions.findOne({qid});

  console.log(questionData);

  if (questionData && questionData.creator_id == id){    // checking if document is valid and cretorid of that question is same as userid 
    var newvalues = { $set: {question: newQuestion } };       // updating the question in db
    const success = await Questions.updateOne(questionData, newvalues);
    console.log(success);
    if (success){
      return res.status(200).json({                 // sending success response if process completed successfully
        success: true,                                
        message: "Question updated successfully!!",
      })
    }
  }
  else{
    return res.status(404).json({           // sending unauthorized error if userid and creator id are not same with status code 404
      success: false,                                
      message: "User not authorized to perform action!!",
    })
  }
}





//--------------------- api function that deletes the question

export const deleteQuestion =async(req,res) =>{  
  const {qid,id} = req.body; // taking question_id , user_id (id of user who wants to update question)

  const questionData = await Questions.findOne({qid});

  if (questionData && questionData.creator_id == id){    // checking if document is valid and cretorid of that question is same as userid 

    const success = await Questions.deleteOne(questionData);
    console.log(success);
    if (success){
      return res.status(200).json({                 // sending success response if process completed successfully
        success: true,                                
        message: "Question deleted successfully!!",
      })
    }
  }
  else{
    return res.status(404).json({           // sending unauthorized error if userid and creator id are not same with status code 404
      success: false,                                
      message: "User not authorized to perform action!!",
    })
  }
}






//----------------------- api function that list all the questions from questions collection

export const listQuestion =async(req,res) =>{
  let questionList = await Questions.find();
  console.log(questionList);
  // questionList.foreach(element => {
  //   console.log(element);
  // });
  return res.status(200).json({
    success: true,
    data: questionList,                               
    message: "All Questions listed successfully!!",
  })
}