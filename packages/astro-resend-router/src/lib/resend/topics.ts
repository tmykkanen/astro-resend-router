import { resend } from "./client.ts";

export const validateRemoteTopic = async (id: string) =>
	await resend.topics.get(id);
