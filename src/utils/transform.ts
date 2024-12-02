import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const transformToMovie = (prevMovies: MovieData): Movie => ({
  title: prevMovies.Title,
  description: prevMovies.Plot,
  imdbId: prevMovies.imdbID,
  imgUrl: prevMovies.Poster,
  imdbUrl: ''
});
