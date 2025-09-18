const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useImageUrl(path?: string): string | null {
  if (!path) return null;
  // If already absolute (starts with http), return as is
  if (path.startsWith("http")) return path;
  return baseUrl + path;
}
