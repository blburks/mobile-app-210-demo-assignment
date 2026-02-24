export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  delay: number = 1000,
): Promise<Response> {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      await wait(delay);
      return fetchWithRetry(url, options, retries - 1, delay);
    }

    throw error;
  }
}
