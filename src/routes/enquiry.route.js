import { Router } from "express";
import {
  submitEnquiry,
  getUnclaimedLeads,
  claimLead,
  getMyClaimedLeads,
} from "../controllers/enquiry.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - No authentication required
router.route("/submit").post(submitEnquiry);

// Protected routes - Require authentication
router.route("/unclaimed").get(verifyJWT, getUnclaimedLeads);
router.route("/claim/:leadId").post(verifyJWT, claimLead);
router.route("/my-leads").get(verifyJWT, getMyClaimedLeads);

export default router;
