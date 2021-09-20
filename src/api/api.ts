const API_URL = 'https://www.omdbapi.com/?apikey=85790e93&';

export const getMovie = async (title:string) => {
  const response = await fetch(`${API_URL}t=${title}`);

  if (!response.ok) {
    throw new Error('Failed to load...');
  }

  return response.json();
};
