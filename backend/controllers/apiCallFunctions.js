/* -------------------------------------------- Importing All the Required Dependencies -------------------------------------------------------- */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Questions } from "../models/question.js";
import { v4 } from 'uuid';

/* ------------------------------------------- Api Functions ------------------------------------------------------------------------------------ */

// -------------------- api functions that creates new user

export const register = async (req, res) => {                           

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




//--------------------------- api to create question
  
export const createQuestion =async(req,res) =>{       
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




// --------------------- api function that updates question

export const updateQuestion =async(req,res) =>{  

  const {id,user_id,newQuestion} = req.body; // taking question_id , user_id (id of user who wants to update question), the new question which one wants to update

  const questionData = await Questions.findOne({id}, function(err, result) { // searching for the document in questions collection which has given question id
    if (err) throw err;           // throwing error if any error occurs
    console.log(result.question);
    return result;                // returning the document if found and storing it in questionData
  });

  if (questionData && questionData.creator_id == user_id){    // checking if document is valid and cretorid of that question is same as userid 
    var newvalues = { $set: {question: newQuestion } };       // updating the question in db
    const success = await Questions.updateOne(questionData, newvalues, function(err, res) {
      if (err) throw err;
      console.log("Question updated");
      return true;
    });
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
  const {id,user_id} = req.body; // taking question_id , user_id (id of user who wants to update question)

  const questionData = await Questions.findOne({id}, function(err, result) { // searching for the document in questions collection which has given question id
    if (err) throw err;           // throwing error if any error occurs
    console.log(result.question);
    return result;                // returning the document if found and storing it in questionData
  });

  if (questionData && questionData.creator_id == user_id){    // checking if document is valid and cretorid of that question is same as userid 

    const success = await Questions.deleteOne(questionData, function(err, obj) {
      if (err) throw err;
      console.log("document deleted");
    });
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

export const listQuestion =async(res) =>{
  let questionList = Questions.find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    return result
  });
  return res.status(200).json({
    success: true,
    data: questionList,                               
    message: "Question added successfully!!",
  })
}