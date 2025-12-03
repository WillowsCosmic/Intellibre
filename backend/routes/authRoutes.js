import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { getProfile, loginUser, registerUser, updateUserProfile } from "../controller/authController.js"

const AuthRouter = express.Router()

AuthRouter.post('/register',registerUser)
AuthRouter.post('/login',loginUser)
AuthRouter.get('/profile',protect,getProfile)
AuthRouter.put('/profile',protect,updateUserProfile);

export default AuthRouter

