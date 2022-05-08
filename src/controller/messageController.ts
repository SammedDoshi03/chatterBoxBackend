/**
 * Message Controller for message related operations
 */

import messages, { IMessage } from "../models/message";
import chatController from "./chatController";
import chats from "../models/chat";
import users from "../models/user";
import mongoose from "mongoose";


 
 export default class messageController {
        
    
        /**
        * creating a new message
        * @param CreateMessage
        */
    
        static async createMessage(message) {
            let parent;
            if(message.parent) {
             parent = new mongoose.Types.ObjectId(message.parent);
            } else {
             parent = "";
            }
            try {
                console.log("display:", message);
                const newMessage = {
                    message: message.value,
                    userName: message[0].title,
                    type: message[0].type,
                    time: message[0].time,
                    conType : message[0].conType,
                    msgType : message.msgType,
                    parent : parent,
                }
                const Message = await messages.create(newMessage);
                // const user = await users.find();
                
                // const chat = chats.updateOne({_id:message[0]._id},{$push:{messages:Message._id}});
                // // return Message;
                const newChat = await chats.find({_id:message[0]._id});
                let messagesLocal = newChat[0].messages; 
                console.log("messagesLocal:", messagesLocal);
                messagesLocal.push(Message.get('_id'));
                console.log("messagesLocal:", messagesLocal);
                const chat = await chats.updateOne({_id:message[0]._id},{$set:{messages:messagesLocal}});
                // // const Message = await messages.create(message);
                return Message;
            } catch (error) {
                console.log("error:", error);
                
                throw error;
            }
        }

        // static async createMessage(message) {
        //     try {
        //         const Message = await messages.create(message);
        //         return Message;
        //     } catch (error) {
        //         throw error;
        //     }
        // }


        /**
         * getting all messages
         * @param id
         * @returns {Promise<*>}
         */
        
        static async getAllMessages(id) : Promise<IMessage[]> {
            try {
                const message = messages.aggregate([
                    {
                        $match: {
                            _id: id
                        },
                    },
                    {
                        $lookup: {
                            from: "messages",
                            localField: "parent",
                            foreignField: "_id",
                            as: "parent"
                        }
                    },
                ]).exec();

                // const message = await messages.find({messageId:id}).populate('messages').exec();
                return message;
            } catch (error) {
                throw error;
            }
        }

        /**
         * Delete a message by id
         * @param id
         */
        static async deleteMessage(id) {
            try {
                const message = await messages.findByIdAndDelete(id);
                return message;
            } catch (error) {
                throw error;
            }
        } 

       
 }