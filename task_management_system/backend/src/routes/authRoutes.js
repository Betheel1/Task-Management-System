const express =require( "express");
const { registerUser, loginUser, getAllUsers } =require( "../controllers/authController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/getUsers',getAllUsers)

module.exports= router;
