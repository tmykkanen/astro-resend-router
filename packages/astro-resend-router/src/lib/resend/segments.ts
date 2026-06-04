import { resend } from "./client.ts";

export const validateRemoteSegment = async (id: string) =>
	await resend.segments.get(id);
