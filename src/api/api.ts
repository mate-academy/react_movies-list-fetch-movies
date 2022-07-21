const BASE_URL = 'https://www.omdbapi.com/?apikey=7272b996';

export const getMovie = async (movieTitle: string) => {
  const response = await fetch(`${BASE_URL}&t=${movieTitle}`);

  if (!response.ok) {
    const { status, statusText } = response;

    throw new Error(`${status} - ${statusText}`);
  }

  return response.json();
};
