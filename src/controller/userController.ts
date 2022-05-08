/**
 * User Controller for user related operations
 */

import user, { IUser } from "../models/user";


export default class userController {



    /**
     * creating a new user
     * @param CreateUser
     */

    static async createUser(CreateUser) {
        try {
            const User = await user.create(CreateUser);
            return User;
        } catch (error) {
            throw error;
        }
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
     * get remaining users for a given user
     * @param id
     * @returns {Promise<*>}
     */

    // static async getRemainingUsers(id) {
    //     try {
    //         const user = await User.find(id);
    //     } catch (error) {
    //         throw error;
    //     }
    // }




}