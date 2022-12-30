import { MovieData } from '../types/MovieData';

export const movieDataToMovie = (movie: MovieData) => ({
  title: movie.Title,
  description: movie.Plot,
  imgUrl: movie.Poster,
  imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
  imdbId: movie.imdbID,
});
