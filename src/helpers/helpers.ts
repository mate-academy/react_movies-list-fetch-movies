import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const createMovie = (movieData: MovieData) => {
  const {
    Title: title,
    Plot: description,
    Poster,
    imdbID: imdbId,
  } = movieData;

  const defaultPoster = (
    'https://via.placeholder.com/360x270.png?text=no%20preview'
  );

  const imgUrl = Poster === 'N/A'
    ? defaultPoster
    : Poster;

  const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

  const movie: Movie = {
    title, description, imgUrl, imdbUrl, imdbId,
  };

  return movie;
};

export const showErrorMessage: (message: string) => string = (message) => {
  return message === 'Movie not found!'
    ? 'Can\'t find a movie with such a title'
    : 'Unexpected error';
};
