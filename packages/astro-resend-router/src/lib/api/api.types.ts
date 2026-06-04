export type APIStatusCache = {
	ok: boolean;
	lastStatusUpdate: {
		timestamp: number;
		code: string | null;
		statusCode: number | null;
	};
};

export type APIHealth = {
	message: string;
	route: string;
	status: APIStatusCache;
	timestamp: number;
	uptime_seconds: number;
	version: string;
};
