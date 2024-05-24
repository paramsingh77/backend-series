import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//JWT - Json Web Token

const userModal = new mongoose.Schema({
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim :true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, //cloudinary url
            required:true,
        },
        coverImage:{
            type:String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video",
            }
        ],
        password:{
            type:String, //needed to be figured
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String,
        }
},{timestamps:true})

userModal .pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password , 10)
    next()
})

userModal.methods.isPasswordCorrect = async function(password){
   return bcrypt.compare(password , this.password)

}

userModal.methods.generateAccessToken = function(){
    jwt.sign({
        _id : this._id,
        email:this.email,
        userName: this.userName,
        fullName: this.fullName
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
       }
    )

}
userModal.methods.generateRefreshToken = function(){
    jwt.sign({
        _id : this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}

export const User = mongoose.model('User' , userModal)