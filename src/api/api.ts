const API_URL = 'https://www.omdbapi.com/?apikey=53395b51&';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error('Error of loading');
  }

  return response.json();
};
