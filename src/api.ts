const API_URL = 'http://www.omdbapi.com/';
const API_KEY = 'd905d6a3';

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(`${API_URL}/?apikey=${API_KEY}&t=${title}`);
  const newMovie = await response.json();

  return newMovie;
}
