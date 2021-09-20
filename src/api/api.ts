const API_URL = 'https://www.omdbapi.com/?apikey=9faefc57';

export const loadMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
