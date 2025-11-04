import { Enquiry } from "../models/enquiry.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Submit enquiry form (Public - No authentication required)
const submitEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, courseInterest, message } = req.body;

  // Validation
  if (!name || !email || !phone || !courseInterest) {
    throw new ApiError(
      400,
      "Name, email, phone, and course interest are required"
    );
  }

  // Create enquiry
  const enquiry = await Enquiry.create({
    name,
    email,
    phone,
    courseInterest,
    message: message || "",
  });

  return res
    .status(201)
    .json(new ApiResponse({
      statusCode: 201,
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    }));
});

// Get all unclaimed leads (Public enquiries)
const getUnclaimedLeads = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, courseInterest } = req.query;

  const query = { isClaimed: false };

  // Filter by course interest if provided
  if (courseInterest) {
    query.courseInterest = { $regex: courseInterest, $options: "i" };
  }

  const unclaimedLeads = await Enquiry.find(query)
    .sort({ createdAt: -1 }) // Most recent first
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Enquiry.countDocuments(query);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      success: true,
      message: "Unclaimed leads fetched successfully",
      data: {
        leads: unclaimedLeads,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalLeads: count,
      }
    })
  );
});

// Claim a lead
const claimLead = asyncHandler(async (req, res) => {
  const { leadId } = req.params;

  if (!leadId) {
    throw new ApiError(400, "Lead ID is required");
  }

  // Find the lead
  const lead = await Enquiry.findById(leadId);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  // Check if already claimed
  if (lead.isClaimed) {
    throw new ApiError(409, "This lead has already been claimed");
  }

  // Claim the lead
  lead.isClaimed = true;
  lead.claimedBy = req.employee._id;
  lead.claimedAt = new Date();

  await lead.save();

  // Populate employee details
  const claimedLead = await Enquiry.findById(lead._id).populate(
    "claimedBy",
    "name email"
  );

  return res
    .status(200)
    .json(new ApiResponse({
      statusCode: 200,
      success: true,
      message: "Lead claimed successfully",
      data: claimedLead
    }));
});

// Get leads claimed by logged-in employee
const getMyClaimedLeads = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, courseInterest } = req.query;

  const query = {
    isClaimed: true,
    claimedBy: req.employee._id,
  };

  // Filter by course interest if provided
  if (courseInterest) {
    query.courseInterest = { $regex: courseInterest, $options: "i" };
  }

  const myLeads = await Enquiry.find(query)
    .sort({ claimedAt: -1 }) // Most recently claimed first
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Enquiry.countDocuments(query);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      success: true,
      message: "Your claimed leads fetched successfully",
      data: {
        leads: myLeads,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalLeads: count,
      }
    })
  );
});

export { submitEnquiry, getUnclaimedLeads, claimLead, getMyClaimedLeads };
