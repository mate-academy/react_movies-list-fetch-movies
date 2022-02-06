const apikey = 'b05ea2b9';
const API_URL = 'https://www.omdbapi.com';

export const findMovie = async (title: string): Promise<Movie> => {
  const url = `${API_URL}?apikey=${apikey}&t=${title}`;

  const response = await fetch(url);

  return response.json();
};
