/**
 * Chat Controller for chat related operations
 */

import chats, { IChat } from "../models/chat";
import user from "../models/user";
import mongoose, { model } from "mongoose";

 
 export default class chatController {
 
   /**
    * getting all chats
    */
    static async getAllChats() : Promise<IChat[]> {
        try {
            const chat = chats.aggregate([
                {
                    $lookup: {
                        from: "messages",
                        localField: "messages",
                        foreignField: "_id",
                        as: "messages"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: "_id",
                        as: "users"
                    }
                },
            ]).exec();

            // const chat = await chats.find().populate('users').populate('messages').populate('messages.parent').exec();
            return chat;
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * get a chat by id
     */
    static async getChatById(data) : Promise<IChat[]> {
        try {
            // console.log(data);
            
            const newId = new mongoose.Types.ObjectId(data.id);
            const newId2 = new mongoose.Types.ObjectId(data.id2);
           const chats = await this.getAllChats();
        //    chats.map(chat => {
        //        console.log("chat:", chat.users[1]._id);
        //        console.log("id:", data.id2);
               
        //    });
               
           const chat = chats.filter(chat => chat.users[0]._id.toString() === newId.toString() && chat.users[1]._id.toString() === newId2.toString());
           console.log("chat:", newId2);
           return chat;
        } catch (error) {
            throw error;
        }
    } 


    /**
     * creating a new chat
     */
    static async createChat(chat) {

        const members = chat.users.split(",")
        members.map(member => {
            member = new mongoose.Types.ObjectId(member);
        });
        try {
            const newChat = {
                messages: null,
                users: members,
                type: chat.type,
                time: new Date(),
                conType: chat.conType,
                title: chat.title,
                noOfUnreadMessages: 0
            }
            const Chat = await chats.create(newChat);
            return Chat;
        } catch (error) {
            throw error;
        }
    } 

    /**
     * Delete a chat by id
     * @param id
     */
    static async deleteChat(id) {
        try {
            const chat = await chats.findByIdAndDelete(id);
            return chat;
        } catch (error) {
            throw error;
        }
    } 

    /**
     * get chat by chat id
     * @param id
     */
    static async getChatByChatID(id) {
        const newId = new mongoose.Types.ObjectId(id);
        try {
            const chat = await chats.find({"_id":newId})
            .populate('users')
            .populate({
                path: 'messages',
                populate: {
                    path: 'parent',
                    model: 'messages',
                }
            })
            .exec();

            //get last message from messages 
            const lastMessage = chat[0].messages[chat[0].messages.length - 1];
            if(lastMessage.seen === false){    
            // find no of messages are seen is false and add the count in noOfUnreadMessages
                chat.map(chat => {
                    let noOfUnreadMessages = 0;
                    chat.messages.map(message => {
                        if(message.seen === false) {
                            noOfUnreadMessages++;
                        }
                    }
                    );
                    chat.noOfUnreadMessages = noOfUnreadMessages;
                });
            }   else {
                chat.map(chat => {
                    chat.noOfUnreadMessages = 0;
                });
            }
            return chat;
        } catch (error) {
            throw error;
        }
    }
 }