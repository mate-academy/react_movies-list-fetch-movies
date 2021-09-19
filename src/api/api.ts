const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=b6b0e744g';

export const loadMovie = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  return response.json();
};
