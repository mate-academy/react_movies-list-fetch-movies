const API_URL = 'https://www.omdbapi.com/?apikey=f6a5875a&t=';

export const getMovie = async (query: string): Promise<Movie> => {
  const response = await fetch(`${API_URL}${query}`);

  if (!response.ok) {
    throw new Error(`Status of error: ${response.status}`);
  }

  return response.json();
};
