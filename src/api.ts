const apiKey = '795f52a1';

const BASE_URL = `https://www.omdbapi.com/?apikey=${apiKey}&t=`;

export const getMovie = async (query: string) => {
  const request = await fetch(`${BASE_URL}${query}`);

  if (!request.ok) {
    throw new Error(`Status of error: ${request.status}`);
  }

  return request.json();
};
