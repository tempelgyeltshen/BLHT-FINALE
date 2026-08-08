import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../../core/config/env.js';
import { AppError } from '../../../core/errors/AppError.js';
import type {
  CloudinarySignatureRequest,
  CloudinarySignatureResponse,
  CloudinaryDeleteRequest,
  CloudinaryDeleteResponse,
} from '../types/cloudinary.types.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true,
});

const isConfigured = () =>
  Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);

export const cloudinaryService = {
  getUploadSignature(req: CloudinarySignatureRequest): CloudinarySignatureResponse {
    if (!isConfigured()) {
      throw new AppError(503, 'Cloudinary is not configured.');
    }

    const { folder = 'blht/media', resource_type = 'auto', public_id, eager } = req;

    const timestamp = Math.round(new Date().getTime() / 1000);
    // Only sign the parameters that are actually sent as form fields to
    // Cloudinary's upload endpoint. resource_type lives in the URL path
    // (e.g. /video/upload) and upload_preset is not used, so signing them
    // would cause a signature mismatch (401) on every upload.
    const signatureParams: Record<string, unknown> = {
      timestamp,
      folder,
    };

    if (public_id) {
      signatureParams.public_id = public_id;
    }

    // Eager transformations are sent as a form field, so they MUST be part
    // of the signed string too — otherwise Cloudinary rejects the signature.
    if (eager) {
      signatureParams.eager = eager;
    }

    const signature = cloudinary.utils.api_sign_request(
      signatureParams,
      env.cloudinaryApiSecret
    );

    return {
      signature,
      timestamp,
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      folder,
      resource_type,
      ...(eager ? { eager } : {}),
    };
  },

  async deleteResource(req: CloudinaryDeleteRequest): Promise<CloudinaryDeleteResponse> {
    const { public_id, resource_type = 'image' } = req;

    if (!public_id) {
      throw new AppError(400, 'public_id is required');
    }

    if (!isConfigured()) {
      throw new AppError(503, 'Cloudinary is not configured.');
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return { success: true, message: 'Resource deleted successfully' };
    }

    throw new AppError(500, `Failed to delete resource: ${result.result}`);
  },
};
