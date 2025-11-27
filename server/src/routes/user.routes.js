import express from "express"
import { signup, login, isAuth, logout, updateProfile } from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/user.middlewares.js"

const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/is-auth', verifyJWT, isAuth)
userRouter.get('/logout', verifyJWT, logout)
userRouter.put('/update-profile', verifyJWT, updateProfile)

export default userRouter