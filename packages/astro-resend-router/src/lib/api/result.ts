export const ok = <T>(value: T) => ({
	ok: true as const,
	value,
});

export const err = <E>(error: E) => ({
	ok: false as const,
	error,
});
