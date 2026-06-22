const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export const apiGet = async (path: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
};
