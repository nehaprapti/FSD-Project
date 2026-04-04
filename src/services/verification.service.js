import Verification from "../models/verification.model.js";
import Driver from "../models/driver.model.js";
import User from "../models/user.model.js";
import { emitToUser, emitToRole } from "../sockets/socketRegistry.js";

const REQUIRED_DOCUMENT_TYPES = ["license", "id_proof", "vehicle_registration", "insurance"];

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureDriverExists = async (driverUserId) => {
  const [user, driverProfile] = await Promise.all([
    User.findOne({ _id: driverUserId, role: "driver" }),
    Driver.findOne({ userId: driverUserId })
  ]);

  if (!user || !driverProfile) {
    throw makeError("Driver not found", 404);
  }

  return { user, driverProfile };
};

const computeOverallVerificationStatus = (docs) => {
  const docsByType = new Map(docs.map((doc) => [doc.documentType, doc]));
  const missingDocuments = REQUIRED_DOCUMENT_TYPES.filter((docType) => !docsByType.has(docType));
  const rejectedDocuments = docs.filter((doc) => doc.reviewStatus === "rejected");
  const pendingOrReviewDocs = docs.filter((doc) => ["pending", "under_review"].includes(doc.reviewStatus));

  const allDocumentsSubmitted = missingDocuments.length === 0;
  const anyRejected = rejectedDocuments.length > 0;
  const allApproved = allDocumentsSubmitted && docs.every((doc) => doc.reviewStatus === "approved");

  let overallStatus = "incomplete";
  if (allApproved) {
    overallStatus = "approved";
  } else if (anyRejected) {
    overallStatus = "rejected";
  } else if (pendingOrReviewDocs.length > 0) {
    overallStatus = "under_review";
  }

  return {
    requiredDocumentTypes: REQUIRED_DOCUMENT_TYPES,
    missingDocuments,
    allDocumentsSubmitted,
    anyRejected,
    rejectedDocuments,
    pendingOrReviewDocs,
    allApproved,
    overallStatus
  };
};

export const uploadVerificationDocument = async ({ driverUserId, documentType, fileRef }) => {
  await ensureDriverExists(driverUserId);

  if (!documentType || !fileRef) {
    throw makeError("documentType and fileRef are required", 400);
  }

  const verificationDoc = await Verification.findOneAndUpdate(
    { driverId: driverUserId, documentType },
    {
      $set: {
        driverId: driverUserId,
        documentType,
        fileRef,
        reviewStatus: "pending",
        remarks: null,
        uploadedAt: new Date()
      }
    },
    { upsert: true, new: true, runValidators: true }
  );

  await Driver.findOneAndUpdate(
    { userId: driverUserId, verificationStatus: "rejected" },
    { $set: { verificationStatus: "under_review", availabilityStatus: false } }
  );

  emitToRole("admin", "admin:ride_feed", {
    type: "verification_uploaded",
    driverUserId: String(driverUserId),
    documentType,
    timestamp: new Date().toISOString()
  });

  return verificationDoc;
};

export const getDriverVerificationStatus = async (driverUserId) => {
  const { driverProfile } = await ensureDriverExists(driverUserId);
  const docs = await Verification.find({ driverId: driverUserId }).sort({ documentType: 1, updatedAt: -1 }).lean();

  const summary = computeOverallVerificationStatus(docs);

  return {
    driverId: String(driverUserId),
    verificationStatus: driverProfile.verificationStatus,
    ...summary,
    documents: docs
  };
};

export const getVerificationQueue = async () => {
  const queuedDocs = await Verification.find({
    reviewStatus: { $in: ["pending", "under_review"] }
  })
    .populate("driverId", "name email phone")
    .sort({ uploadedAt: 1, updatedAt: 1 })
    .lean();

  const queueByDriver = new Map();

  for (const doc of queuedDocs) {
    const key = String(doc.driverId?._id || doc.driverId);

    if (!queueByDriver.has(key)) {
      queueByDriver.set(key, {
        driverId: key,
        driver: doc.driverId,
        documents: []
      });
    }

    queueByDriver.get(key).documents.push(doc);
  }

  return Array.from(queueByDriver.values());
};

export const approveDriverVerification = async ({ driverUserId, adminUserId }) => {
  await ensureDriverExists(driverUserId);

  const docs = await Verification.find({ driverId: driverUserId });
  const summary = computeOverallVerificationStatus(docs);

  if (!summary.allDocumentsSubmitted) {
    throw makeError(
      `Cannot approve driver until all required documents are uploaded: ${summary.missingDocuments.join(", ")}`,
      400
    );
  }

  if (summary.anyRejected) {
    const rejectedTypes = summary.rejectedDocuments.map((doc) => doc.documentType).join(", ");
    throw makeError(`Cannot approve driver with rejected documents pending re-upload: ${rejectedTypes}`, 400);
  }

  await Verification.updateMany(
    { driverId: driverUserId, reviewStatus: { $in: ["pending", "under_review"] } },
    {
      $set: {
        reviewStatus: "approved",
        remarks: null
      }
    }
  );

  const driver = await Driver.findOneAndUpdate(
    { userId: driverUserId },
    { $set: { verificationStatus: "approved" } },
    { new: true }
  );

  if (!driver) {
    throw makeError("Driver profile not found", 404);
  }

  emitToUser(String(driverUserId), "driver:verification_status", {
    status: "approved",
    reviewedBy: String(adminUserId),
    timestamp: new Date().toISOString()
  });

  return {
    driverId: String(driverUserId),
    verificationStatus: driver.verificationStatus
  };
};

export const rejectDriverVerification = async ({ driverUserId, adminUserId, documentType, reason }) => {
  await ensureDriverExists(driverUserId);

  const targetDoc = await Verification.findOne({ driverId: driverUserId, documentType });
  if (!targetDoc) {
    throw makeError(`Document ${documentType} not found for driver`, 404);
  }

  targetDoc.reviewStatus = "rejected";
  targetDoc.remarks = reason;
  await targetDoc.save();

  await Verification.updateMany(
    {
      driverId: driverUserId,
      _id: { $ne: targetDoc._id },
      reviewStatus: "pending"
    },
    {
      $set: { reviewStatus: "under_review" }
    }
  );

  await Driver.findOneAndUpdate(
    { userId: driverUserId },
    { $set: { verificationStatus: "rejected", availabilityStatus: false } }
  );

  emitToUser(String(driverUserId), "driver:verification_status", {
    status: "rejected",
    documentType,
    reason,
    reviewedBy: String(adminUserId),
    timestamp: new Date().toISOString()
  });

  return {
    driverId: String(driverUserId),
    documentType,
    status: "rejected",
    reason
  };
};

export { REQUIRED_DOCUMENT_TYPES };
