const API_KEY = 'af8590f8';
const URL = `https://www.omdbapi.com/?apikey=${API_KEY}&t=`;

export const getMovies = async (title: string): Promise<Movie> => {
  const response = await fetch(`${URL}${title}`);

  return response.json();
};
