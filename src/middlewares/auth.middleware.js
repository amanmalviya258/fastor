import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from "../models/employee.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find employee
    const employee = await Employee.findById(decodedToken?._id).select(
      "-password"
    );

    if (!employee) {
      throw new ApiError(401, "Invalid access token - Employee not found");
    }

    // Attach employee to request
    req.employee = employee;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw error;
  }
});
