import { Movie } from '../react-app-env';

export async function getMovie(title: string): Promise<Movie> {
  const promis = await fetch(`https://www.omdbapi.com/?apikey=89317555&t=${title}`);

  const result = await promis.json();

  return result;
}

export async function getMovieById(id: string): Promise<Movie> {
  const promis = await fetch(`https://www.omdbapi.com/?tt=${id}&apikey=89317555`);

  const result = await promis.json();

  return result;
}
