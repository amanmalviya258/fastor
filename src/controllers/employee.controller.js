import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

// Register employee
const registerEmployee = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if employee already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    throw new ApiError(409, "Employee with this email already exists");
  }

  // Create employee
  const employee = await Employee.create({
    email,
    password,
    name,
  });

  // Get employee without password
  const createdEmployee = await Employee.findById(employee._id).select(
    "-password"
  );

  if (!createdEmployee) {
    throw new ApiError(500, "Something went wrong while registering employee");
  }

  return res
    .status(201)
    .json(
      new ApiResponse({
        statusCode: 201,
        success: true,
        message: "Employee registered successfully",
        data: createdEmployee
      })
    );
});

// Login employee
const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find employee
  const employee = await Employee.findOne({ email });
  if (!employee) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check password
  const isPasswordValid = await employee.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    employee._id
  );

  // Store refresh token in DB
  employee.refreshToken = refreshToken;
  await employee.save();

  // Get employee without password
  const loggedInEmployee = await Employee.findById(employee._id).select(
    "-password"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        success: true,
        message: "Employee logged in successfully",
        data: {
          employee: loggedInEmployee,
          accessToken,
          refreshToken,
        }
      })
    );
});

// Logout employee
const logoutEmployee = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  return res.status(200).json(new ApiResponse({
        statusCode: 200,
        success: true,
        message: "Employee logged out in successfully",
      }))
});

// Get current employee
const getCurrentEmployee = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse({
        statusCode: 200,
        success: true,
        message: "Current employee fetched successfully",
        data: req.employee
      })
    );
});

export {
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  getCurrentEmployee,
};
