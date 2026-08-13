 import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/monogo.config.js";
import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";

dotenv.config("./.env");

const app = express();

// ✅ Express ko proxy Trust karne ke liye (Vercel/Render ke cookie issue ke liye)
app.set("trust proxy", 1);

// ✅ Saare frontend domains ko include kar diya gaya hai
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://url-shortner-theta-rust.vercel.app', // Direct Vercel App Link
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : ""
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Postman / Mobile app / Direct calls allow karne ke liye !origin check rakha hai
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(attachUser);

app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);
app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});