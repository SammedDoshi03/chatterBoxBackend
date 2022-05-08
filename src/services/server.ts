/**
 * @info the main entry point of express server
 */

import express, {Request, Response} from "express";

import bodyParser from "body-parser";
import responseToPostman from "../middleware/responseToPostman";
import expressLog from "../middleware/expressLog";

import Joi from "joi";
import session from "express-session";
import MongoStore from "connect-mongo";
import userController from "../controller/userController";
import chatController from "../controller/chatController";
import messageController from "../controller/messageController";



export default class Server {
    app = express();

    async start() {
        console.log("Server started");
        this.app.listen(process.env.PORT);
        console.log("Server listening on port: " + process.env.PORT);

        this.middleware();
        this.routes();
        this.defRoutes();
    }

    /**
     * @info middleware
     */
    middleware() {
        this.app.use(expressLog);
        this.app.use(bodyParser.json());
        // this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: new MongoStore({
                    mongoUrl: process.env.SESSION_MONGODB_URL,
                    collectionName: "sessions",
                }),
                cookie: {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                },
            }),
        );
        // Uncomment this line to create Admin at beginning only
        // adminController.create();
    }

    /**
     * @info define routes
     */

    routes() {
        this.app.get("/", (req: Request, res: Response) => {
            console.log("GET /");
            res.send("Welcome to ChatterBox");
        });

        this.app.get("/api/v1/chat/getAllChats", responseToPostman((req: Request, res: Response) => {

            return chatController.getAllChats();
        }));
       
        this.app.get("/chats", responseToPostman((req: Request, res: Response) => {
                return chatController.getChatById(req.body.id);
        }));

        this.app.get("/messages", responseToPostman((req: Request, res: Response) => {
            return messageController.getAllMessages(req.body.id);
        }));
        this.app.post("/api/v1/chat/addMessage", responseToPostman((req: Request, res: Response) => {
            // console.log(req.body);
            
            return messageController.createMessage(req.body);
        }));
        this.app.post("/chatMessage", responseToPostman((req: Request, res: Response) => {
        //    console.log(req.body);
           
            return chatController.createChat(req.body);
        }));
        this.app.delete("/api/v1/chat/deleteChat/:id", responseToPostman((req: Request, res: Response) => {
            return chatController.deleteChat(req.params.id);
        }));
        this.app.delete("/api/v1/chat/deleteMessage/:id", responseToPostman((req: Request, res: Response) => {
            return messageController.deleteMessage(req.params.id);
        }   
        ));
        this.app.post("/api/v1/chat/getChatById", responseToPostman((req: Request, res: Response) => {
            // console.log(req.body);
            
            return chatController.getChatById(req.body);
        }));
        this.app.post("/addUser", responseToPostman((req: Request, res: Response) => {
            return userController.createUser(req.body);
        }))
    }

    /**
     * @info define the default routes
     */

    defRoutes() {
        // check if server running
        this.app.all("/", (req, resp) => {
            resp.status(200).send({ success: true, message: "Server is working" });
        });

        this.app.all("*", (req, resp) => {
            resp.status(404).send({ success: false, message: `given route [${req.method}] ${req.path} not found` });
        });
    }
}
