import { InfraiClient } from "./infrai_client.ts";

export type CreatorSubmission = { creatorId: string; caption: string; image: string; filename: string };
export type ScreeningResult = { decision: "approved" | "rejected"; reason: string; assetId?: string };

const blocked = /\b(spam|scam|pirated|hate)\b/i;

type UploadClient = { upload(file: string, filename: string, requestId: string): Promise<{ id: string }> };
export async function screenAndDeliver(submission: CreatorSubmission, client: UploadClient = new InfraiClient()): Promise<ScreeningResult> {
  if (!submission.caption.trim()) return { decision: "rejected", reason: "Caption is required for review." };
  if (blocked.test(submission.caption)) return { decision: "rejected", reason: "Caption needs a teacher review before publishing." };
  const uploaded = await client.upload(submission.image, submission.filename, `creator-${submission.creatorId}-${submission.filename}`);
  return { decision: "approved", reason: "Caption passed the classroom-friendly review.", assetId: uploaded.id };
}
