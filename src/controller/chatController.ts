/**
 * Chat Controller for chat related operations
 */

import chats, { IChat } from "../models/chat";
import user from "../models/user";
import mongoose from "mongoose";

 
 export default class chatController {
 
   /**
    * getting all chats
    */
    static async getAllChats() : Promise<IChat[]> {
        try {
            const chat = await chats.aggregate([
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
                }
            ]).exec();
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
     * get a chat by id
     * @param id
     */
    static async getUserByChatId(id) {
        try {
            const chat = await chats.findById(id).exec();
        } catch (error) {
            throw error;
        }
    }


    /**
     * creating a new chat
     */
    static async createChat(chat) {
        try {
            const Chat = await chats.create(chat);
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
       
 }