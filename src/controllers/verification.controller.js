import {
  uploadVerificationDocument,
  getDriverVerificationStatus,
  getVerificationQueue,
  approveDriverVerification,
  rejectDriverVerification
} from "../services/verification.service.js";

export const uploadVerification = async (req, res, next) => {
  try {
    const data = await uploadVerificationDocument({
      driverUserId: req.user.userId,
      documentType: req.body.documentType,
      fileRef: req.body.fileRef
    });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getVerificationStatus = async (req, res, next) => {
  try {
    const data = await getDriverVerificationStatus(req.user.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getAdminVerificationQueue = async (req, res, next) => {
  try {
    const data = await getVerificationQueue();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const approveDriverVerificationByAdmin = async (req, res, next) => {
  try {
    const data = await approveDriverVerification({
      driverUserId: req.params.driverId,
      adminUserId: req.user.userId
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const rejectDriverVerificationByAdmin = async (req, res, next) => {
  try {
    const data = await rejectDriverVerification({
      driverUserId: req.params.driverId,
      adminUserId: req.user.userId,
      documentType: req.body.documentType,
      reason: req.body.reason
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
