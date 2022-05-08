/**
 * @info schema for User model
 */


 import {Schema, model} from "mongoose"
 import {generate} from "shortid"
 
 export interface IUser {
     _id: string;
     uid: string;
     name: string;
     phone: string;
     password: string;
     avatar: string;
 }
 
 const schema = new Schema({
     uid:{
         type:String,
         unique:true,
         default: generate,
         index: true
     },
     name:{
         type: String,
         required:true
     },
     phone:{
         type:String,
         unique:true,
         index:true,
         required: true
     },
     password:{
         type:String,
         required:true
     },
     avatar:{
         type:String,
            default:"https://images.unsplash.com/photo-1623582854588-d60de57fa33f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
     }
 },
    {
        timestamps: true
    }
 )
 
 export default model<IUser>("users",schema)
 