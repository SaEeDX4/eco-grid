import express from "express";
import {
  getDevices,
  getDevice,
  controlDevice,
  addDevice,
  removeDevice,
  scheduleDevice,
} from "../controllers/deviceController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All device routes require authentication
router.use(authenticate);

// GET /api/devices - Get all user's devices
router.get("/", getDevices);

// GET /api/devices/:id - Get single device with readings
router.get("/:id", getDevice);

// POST /api/devices - Add new device
router.post("/", addDevice);

// POST /api/devices/:id/control - Control device
router.post("/:id/control", controlDevice);

// POST /api/devices/:id/schedule - Set device schedule
router.post("/:id/schedule", scheduleDevice);

// DELETE /api/devices/:id - Remove device
router.delete("/:id", removeDevice);

export default router;
