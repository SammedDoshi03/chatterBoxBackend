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
             parent="6277a375bb6bdf65917b6d54";
            }
            try {
                // console.log("display:", message);
                const newMessage = {
                    message: message.value,
                    userName: message[0].title,
                    type: message[0].type,
                    time: message[0].time,
                    conType : message[0].conType,
                    msgType : message.msgType,
                    parent : parent,
                    seen : true
                }
                const Message = await messages.create(newMessage);
                const newChat = await chats.find({_id:message[0]._id}).populate('users');
                let messagesLocal = newChat[0].messages; 
                const chat = await chats.updateMany({_id:message[0]._id},{$set:{messages:messagesLocal}},{$set:{noOfUnreadMessages:0}});
                const chatMessage = await chatController.getChatByChatID(message[0]._id);
                const listOfMessage = chatMessage[0].messages;
                listOfMessage.map(message => {
                    message.seen = true;
                });
                const updateMessages = chats.updateOne({_id:message[0]._id},{$set:{messages:listOfMessage}});
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