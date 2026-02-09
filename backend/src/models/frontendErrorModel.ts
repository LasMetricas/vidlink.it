import mongoose, { Document, Model, Schema } from "mongoose";

interface IFrontendError extends Document {
  userId?: string;
  userEmail?: string;
  errorMessage: string;
  errorStack?: string;
  errorType: string; // 'error', 'unhandledrejection', 'component', 'network'
  url: string;
  userAgent: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  metadata?: {
    componentStack?: string;
    lineNumber?: number;
    columnNumber?: number;
    filename?: string;
    [key: string]: any;
  };
}

const FrontendErrorSchema = new Schema<IFrontendError>(
  {
    userId: { type: String },
    userEmail: { type: String },
    errorMessage: { type: String, required: true },
    errorStack: { type: String },
    errorType: { type: String, required: true, enum: ["error", "unhandledrejection", "component", "network"] },
    url: { type: String, required: true },
    userAgent: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Index for faster queries
FrontendErrorSchema.index({ timestamp: -1 });
FrontendErrorSchema.index({ resolved: 1 });
FrontendErrorSchema.index({ userId: 1 });

const FrontendError: Model<IFrontendError> = mongoose.model<IFrontendError>(
  "FrontendError",
  FrontendErrorSchema
);

export default FrontendError;

