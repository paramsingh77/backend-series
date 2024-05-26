import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.modal.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) =>{
    // Getting details user from frontend
    // Validation - not empty
    // Check if user already exist username , email
    // check for images . check for avatar,
    // Upload them cloudinary
    // create user object - create entry in db
    // Remove password and remove fresh token field form response.
    // check for user creation
    // return response
    
    const {fullName , email , userName , password} = req.body
    console.log("email:" , email);

    if(
        [fullName,email,userName,password].some((filed)=>filed?.trim() ==="")
    ){
        throw new ApiError(400,"All Fields are compulsory")
    }
    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath =  req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    
    //uploading on cloudinary
   const avatar =  await uploadOnCloudinary(avatarLocalPath) 
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400 , "Avatar file is required")
   }

   await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url ||"",
    email,
    password,
    userName: userName.toLowercase()
   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user")
   }
   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
   )
} )

export {registerUser}