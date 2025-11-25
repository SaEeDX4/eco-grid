import VPPDispatch from "../models/VPPDispatch.js";
import vppDispatchService from "../services/vppDispatchService.js";

export const getUpcomingDispatches = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { limit = 10 } = req.query;

    const dispatches = await vppDispatchService.getUpcomingDispatches(
      req.user._id,
      parseInt(limit)
    );

    res.json({
      success: true,
      dispatches,
      count: dispatches.length,
    });
  } catch (error) {
    console.error("Get upcoming dispatches error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming dispatches",
    });
  }
};

export const getDispatchHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { status, startDate, endDate, limit = 50 } = req.query;

    const options = {
      status,
      startDate,
      endDate,
      limit: parseInt(limit),
    };

    const dispatches = await vppDispatchService.getDispatchHistory(
      req.user._id,
      options
    );

    res.json({
      success: true,
      dispatches,
      count: dispatches.length,
    });
  } catch (error) {
    console.error("Get dispatch history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispatch history",
    });
  }
};

export const getDispatchCalendar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const calendar = await vppDispatchService.getDispatchCalendar(req.user._id);

    res.json({
      success: true,
      calendar,
    });
  } catch (error) {
    console.error("Get dispatch calendar error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispatch calendar",
    });
  }
};

export const getDispatchStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { days = 30 } = req.query;

    const stats = await vppDispatchService.getUserDispatchStats(
      req.user._id,
      parseInt(days)
    );

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get dispatch stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispatch stats",
    });
  }
};

export const cancelDispatch = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    // Verify dispatch belongs to user
    const dispatch = await VPPDispatch.findById(id);

    if (!dispatch) {
      return res.status(404).json({
        success: false,
        message: "Dispatch not found",
      });
    }

    if (dispatch.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const cancelledDispatch = await vppDispatchService.cancelDispatch(
      id,
      reason
    );

    res.json({
      success: true,
      message: "Dispatch cancelled successfully",
      dispatch: cancelledDispatch,
    });
  } catch (error) {
    console.error("Cancel dispatch error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel dispatch",
    });
  }
};

export const getDispatchById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const dispatch = await VPPDispatch.findById(id)
      .populate("poolId", "name region")
      .populate("deviceId", "name type")
      .populate("bidId")
      .lean();

    if (!dispatch) {
      return res.status(404).json({
        success: false,
        message: "Dispatch not found",
      });
    }

    // Verify access
    if (dispatch.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      dispatch,
    });
  } catch (error) {
    console.error("Get dispatch by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispatch",
    });
  }
};
