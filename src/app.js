import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js"; //globalHandler file import
import { asyncHandler } from "./utils/asyncHandler.js";

const app = express();

// Request logging middleware
// app.use((req, res, next) => {
//     console.log(`Request received: ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     next();
// });

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow all origins for development
    credentials: true,
    methods: "GET,HEAD,PUT,POST,DELETE",
  }),
);


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static("public"));

//routes
import healthCheckerRouter from "./routes/health.Route.js";
import employeeRouter from "./routes/employee.route.js";
import enquiryRouter from "./routes/enquiry.route.js";

//routes declaration
app.use("/api/v1/health", healthCheckerRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/enquiries", enquiryRouter);

// Global error handler should be last
app.use(globalErrorHandler);

export { app };
