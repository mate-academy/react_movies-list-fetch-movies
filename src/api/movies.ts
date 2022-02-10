const API_URL = 'https://www.omdbapi.com/?apikey=';
const myKey = 'e8e80aa3';

export const getMovie = async (title: string): Promise<Movie> => {
  const response = await fetch(`${API_URL}${myKey}&t=${title}`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error('Movie is not found');
  }

  return movie;
};
