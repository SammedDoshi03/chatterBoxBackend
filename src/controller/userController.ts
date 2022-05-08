/**
 * User Controller for user related operations
 */

import user, { IUser } from "../models/user"
import Bcrypt from "../services/bcrypt";
import mongoose from "mongoose";


export default class userController {



    /**
     * creating a new user
     * @param CreateUser
     */

     static async create(body:any): Promise<IUser> {
        const hash = await Bcrypt.hashing(body.password);
        const data = {
            ...body,
            password: hash,
        };
        return user.create(data);
        }

    /**
     * getting all users
     */

    static async getAllUsers() : Promise<IUser[]> {
        try {
            const users = await user.find();
            return users;
        } catch (error) {
            throw error;
        }
    }

    /**
     * getting a user by id
     * @param id
     * @returns {Promise<*>}
     */

    static async getUserById(id) : Promise<IUser> {
        try {
            const User = await user.find(id);
            return User[0];
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param phone
     * @param password 
     * @returns 
     */
     static async auth(phone:string,password:string): Promise<IUser> {
        //fetch data from database
        const users =  await user.findOne({phone: phone}).lean()
        // check user is exists or not
        if (users)
        {
                //comparing the password with hash
            const res= await Bcrypt.comparing(password, users.password);
                //check correct or not
                if(res) return users;
                else throw new Error("wrong password")
        }
         throw new Error("user does not exist");
       
    }
    
    /**
     * Get User Profile
     * @param _id
     * @returns user
     */
     static async getUserProfile(_id) {
        const users = await user.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(_id)
                },
            },
            {
                $project:{
                    "password": 0,
                }
            },
        ]).exec();
        if(users) return users;
        else throw new Error("user not exists");
    }




}