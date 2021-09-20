const API_URL = 'https://www.omdbapi.com/?apikey=b6b0e744&';

export const loadMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
