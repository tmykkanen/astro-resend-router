import type {
	EndpointOutcome,
	EndpointStatus,
	ServerStatus,
	WebhookStatus,
} from "../contracts/api.types.ts";

export const serverStatus: ServerStatus = {
	startedAt: new Date().toISOString(),
	startedAtMs: Date.now(),
};

export const webhookStatus: WebhookStatus = {
	lastEvent: null,
	lastStatus: "unknown",
};

export const endpointStatus: EndpointStatus = {
	ok: false,
	lastRequestAt: null,
	lastResponseAt: null,
	lastResponse: {
		statusCode: null,
		outcome: "unknown",
	},
};

export const markRequestReceived = () => {
	endpointStatus.lastRequestAt = new Date().toISOString();
};

export const markResponseSent = (
	ok: boolean,
	outcome: EndpointOutcome,
	statusCode: number,
) => {
	endpointStatus.ok = ok;
	endpointStatus.lastResponseAt = new Date().toISOString();
	endpointStatus.lastResponse = {
		statusCode,
		outcome,
	};
};
