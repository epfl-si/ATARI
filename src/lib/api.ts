"use server";

export async function makeApiCall<T = unknown>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const baseUrl = process.env.API_URL;
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error("API credentials not configured");
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }
  }

  const headers = new Headers();
  headers.set("Authorization", `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`);

  console.log(`Making API call to: ${url.toString()}`);
  console.log(
    `curl -X GET "${url.toString()}" -H "Authorization: Basic ${Buffer.from(`${username}:${password}`).toString("base64")}"`,
  );

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return await response.json();
}
