const express = require("express");
const router = express.Router();
const passport = require("passport")
require("../passport");
const { signup } = require("../controllers/authService");
const User = require("../models/usermodel");
const cookie = require("cookie");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getAccessToUserRoute } = require("../middlewares/authorization/authUser");
require("dotenv").config();
const Post=require("../models/postmodel");

router.use(passport.initialize());
router.use(passport.session());

router.post("/signup", signup);
router.get("/signupwithgoggle", passport.authenticate('google', { scope: ['email', 'profile'] }))

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_ACCESS_KEY
    },
    region: S3_BUCKET_REGION
})

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure' }),
    async (req, res) => {
        try {
            const email = req.user.email;
            let token;
            const IsAvailableUser = await User.findOne({ email: email });
            if (!IsAvailableUser) {
                const newUser = new User({ email: email });
                const savedUser = await newUser.save();
                token = savedUser.generateJWTFromUser();
            }
            else {
                token = IsAvailableUser.generateJWTFromUser();
            }

            res.setHeader("Set-Cookie", cookie.serialize("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60,
                path: "/"
            }));

            res.redirect(`http://localhost:3000/home`);
        } catch (error) {
            console.log(error, "error is ");
        }
    }
);

router.get("/get-token", (req, res) => {
    const token = req.cookies.token; // Read token from HTTP-only cookie

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }
    res.json({ token });
});

router.get("/failure", (req, res) => {
    res.status(401).json({ message: "Authentication failed" });
});

router.post(`/images`, upload.single('image'), getAccessToUserRoute, async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;
        req.file.buffer
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        }
        const command = new PutObjectCommand(params);
      
        await s3.send(command);
        const imageUrl = `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${req.file.originalname}`;

        // Save image details in MongoDB
        const newImage = new Post({
            userId: user.id,
            imageName: imageUrl, // Save image URL instead of name
        });

        await newImage.save();

        return res.status(200).json({
            success:true,
            message: "Image uploaded successfully",
            imageUrl: imageUrl, // Return uploaded image URL
        });
    } catch (error) {
        console.log("error is",error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get(`/getImage`,getAccessToUserRoute,async(req,res)=>{
    try {
         const user=req.user;
         const data = await Post.find({ userId:user.id });
         return res.status(200).json({data:data});
    } catch (error) {
        return res.status(500).json({message:"database error"});
    }
})

// router.get("/signin",signIn)
module.exports = router;