// src/utils/fetcher.ts
/*
 * Fetcher function for fetching JSON data from an API endpoint
 *
 * @param {RequestInfo} input - The URL or request object
 * @param {RequestInit} [init] - Optional request options
 * @returns {Promise<JSON>} - The JSON response from the API
 */
export default async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init)

  return res.json()
}
