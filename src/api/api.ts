import { Movie } from '../react-app-env';

const API_URL = 'https://www.omdbapi.com/?apikey=830ad734&t=';

export const getMovie = async (title: string): Promise<Movie> => {
  const response = await fetch(`${API_URL}${title}`);

  return response.json();
};
