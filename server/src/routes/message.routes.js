import express from "express"
import { getMessages, getUsersForSideBar, markMessageAsSeen, sendMessage } from "../controllers/message.controllers.js"
import { verifyJWT } from "../middlewares/user.middlewares.js"

const messageRouter = express.Router()

messageRouter.get('/users', verifyJWT, getUsersForSideBar)
messageRouter.get('/:id', verifyJWT, getMessages)
messageRouter.put('/mark/:id', verifyJWT, markMessageAsSeen)
messageRouter.post('/send/:id', verifyJWT, sendMessage)

export default messageRouter