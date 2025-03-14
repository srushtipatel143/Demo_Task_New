const express=require("express");
const app=express();
const cors=require("cors")
const errorHandler = require("./helpers/errors/errorHandler");
const session = require("express-session");
const userRouter=require("./routes/userRoutes");
const cookieParser=require("cookie-parser")


app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.SESSION_SECRET
}))
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true           
}));
app.use(cookieParser());


app.use("/api/auth/user",userRouter);

app.use((err, req, res, next) => {
    if (err instanceof errorHandler) {
        return res.status(err.statusCode).json({
            statusCode:err.statusCode,
            message: err.message,
            error: err.error || "No additional details provided",
        });
    }
    return res.status(500).json({
        error: "Internal Server Error",
        status: 500,
    });
});

module.exports=app;