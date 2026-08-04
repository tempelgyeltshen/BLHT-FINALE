import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
const contentSchema = new Schema({ collection: { type: String, required: true, index: true }, data: { type: Schema.Types.Mixed, required: true } }, { timestamps: true, versionKey: false });
contentSchema.index({ collection: 1, 'data.slug': 1 }, { unique: true, sparse: true });
export const ContentModel = models.Content || model('Content', contentSchema);
