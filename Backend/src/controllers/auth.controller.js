const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {

    try {

        console.log("Register Body => ", req.body)

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email and password"
            })
        }

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        console.log("Existing User => ", existingUser)

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Account already exists with this email or username"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        console.log("Created User => ", user)

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        console.log("TOKEN CREATED => ", token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        })

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }

}

// async function registerUserController(req, res) {

//     console.log("Register Body => ", req.body)

//     const { username, email, password } = req.body;

//     console.log("username => ", username)
//     console.log("email => ", email)

//     if (!username || !email || !password) {
//         console.log("Missing fields")
//         return res.status(400).json({
//             message: "Please provide username, email and password",
//         });
//     }

//     const isUserAlreadyExists = await userModel.findOne({
//         $or: [{ username }, { email }],
//     });

//     console.log("Existing User => ", isUserAlreadyExists)

//     if (isUserAlreadyExists) {
//         return res.status(400).json({
//             message: "Account already exists with this email address or username",
//         });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const user = await userModel.create({
//         username,
//         email,
//         password: hash,
//     });

//     console.log("Created User => ", user)
//     res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   path: "/"
// });
// console.log("TOKEN CREATED => ", token)

//     res.status(201).json({
//         success: true,
//         user
//     });


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
// async function loginUserController(req, res) {
//     console.log("Login Body => ", req.body)
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return res.status(400).json({
//       message: "Invalid email or password",
//     });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(400).json({
//       message: "Invalid email or password",
//     });
//   }

//   const token = jwt.sign(
//     { id: user._id, username: user.username },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" },
//   );

//   // res.cookie("token", token)
//   //     res.cookie("token", token, {
//   //     httpOnly: true,
//   //     secure: false,
//   //     sameSite: "lax"
//   // })

//   // return res.status(200).json({
//   //     message: "User loggedIn successfully.",
//   //     user: {
//   //         id: user._id,
//   //         username: user.username,
//   //         email: user.email
//   //     }
//   // })
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//   });

//   return res.status(200).json({
//     message: "User loggedIn successfully.",
//     user: {
//       id: user._id,
//       username: user.username,
//       email: user.email,
//     },
//   });
// }

// async function loginUserController(req, res) {

//     const { email, password } = req.body

//     console.log("Email => ", email)

//     const user = await userModel.findOne({ email })

//     console.log("User Found => ", user)

//     if (!user) {
//         return res.status(400).json({
//             message: "Invalid email or password"
//         })
//     }

//     const isPasswordValid = await bcrypt.compare(
//         password,
//         user.password
//     )

//     console.log("Password Match => ", isPasswordValid)

//     if (!isPasswordValid) {
//         return res.status(400).json({
//             message: "Invalid email or password"
//         })
//     }

//     const token = jwt.sign(
//         {
//             id: user._id,
//             username: user.username
//         },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: "1d"
//         }
//     )

//     // res.cookie("token", token, {
//     //     httpOnly: true,
//     //     secure: false,
//     //     sameSite: "lax"
//     // })

//     res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   path: "/"
// });
// console.log("TOKEN CREATED => ", token)
//     return res.status(200).json({
//         message: "User logged in successfully",
//         user: {
//             id: user._id,
//             username: user.username,
//             email: user.email
//         }
//     })
// }
async function loginUserController(req, res) {

    try {

        const { email, password } = req.body

        console.log("Email => ", email)

        const user = await userModel.findOne({ email })

        console.log("User Found => ", user)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        console.log("Password Match => ", isPasswordValid)

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        console.log("TOKEN CREATED => ", token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        })

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }

}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully",
  });
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
// async function getMeController(req, res) {
//   console.log("req.user => ", req.user);

//   const user = await userModel.findById(req.user.id);

//   console.log("DB User => ", user);

//   console.log("Response User => ", {
//     id: user._id,
//     username: user.username,
//     email: user.email
// })
// res.status(200).json({
//     message: "User details fetched successfully",
//     user: {
//         id: user._id,
//         username: user.Username,
//         email: user.email
//     }
// })

// //   res.status(200).json({
// //     message: "User details fetched successfully",
// //     user: {
// //       id: user._id,
// //       username: user.username,
// //       email: user.email,
// //     },
// //   });
// }

async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}
module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
