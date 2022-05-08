/**
 * @info schema for Chat model
 */


 import {Schema, model} from "mongoose"
 import {generate} from "shortid"
import { IMessage } from "./message";
import { IUser } from "./user";
 
 export interface IChat {
    _id: string;
    chatId: string;
    messages: IMessage[];
    users: IUser[];
    type: string;
    time: Date;
    conType: string;
    title: string;
 }
 
 const schema = new Schema({
    chatId:{
        type: String,
        unique:true,
        default: generate,
    },
    messages:[{
        type: [Schema.Types.ObjectId],
        ref: "messages",
    }],
    users:[{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    type:{
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
    title:{
        type: String,
    },
 },
    {
        timestamps: true
    }
 )
 
 export default model<IChat>("chats",schema)
 