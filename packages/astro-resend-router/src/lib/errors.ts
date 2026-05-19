export const errorResponse = (message: string, status: number) => {
  console.warn(message);
  return new Response(JSON.stringify({ message }), { status });
};
