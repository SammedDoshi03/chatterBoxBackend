/**
 * @info schema for Message model
 */


import {Schema, model} from "mongoose"
import {generate} from "shortid"


 
 export interface IMessage {
    _id: string;
    messageId: string;
    message: string;
    userName: string;
    type: string;
    time: Date;
    conType: string;
    msgType: string;
    parent: string;
 }
 
 const schema = new Schema({
    messageId:{
        type: String,
        unique:true,
        default: generate,
    },
    message:{
        type: String,
        required:true
    },
    userName:{
        type: String,
        required:true
    },
    time:{
        type: Date,
        default: Date.now
    },
    conType:{
        type: String,
        required:true
    },
    msgType:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required:true
    },
    parent:{
        type: String,
        // required:true   
    }
 },
    {
        timestamps: true
    }
 )
 
 export default model<IMessage>("messages",schema)
 