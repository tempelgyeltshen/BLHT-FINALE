import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

/**
 * Admin user persisted in MongoDB. Authentication prefers the environment
 * based ConfigAdminRepository, but this model is used when admins are
 * managed through the database.
 */
const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true, versionKey: false },
);

export type AdminDoc = {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
};

export const AdminModel = (models.Admin as mongoose.Model<AdminDoc>) ||
  model<AdminDoc>('Admin', adminSchema);
