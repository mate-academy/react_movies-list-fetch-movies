import { Movie } from '../react-app-env';

export async function getMovie(title: string): Promise<Movie> {
  const result = await fetch(`https://www.omdbapi.com/?apikey=89317555&t=${title}`);

  return result.json();
}

export async function getMovieById(id: string): Promise<Movie> {
  const result = await fetch(`https://www.omdbapi.com/?tt=${id}&apikey=89317555`);

  return result.json();
}
