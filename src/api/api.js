const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=20bbe522&t=';

export const getMovie = async (query) => {
  const response = await fetch(`${BASE_URL}${query}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};
