const express = require("express");
const router = express.Router();
// const {home,register} = require("../Controller/auth-controller");
const authController = require("../Controller/auth-controller");

// router.get('/', (req, res) => {
//     res.status(200).send('welcome')
// })

router.route("/").get(authController.home);
router.route("/register").post(authController.register);

module.exports = router;
