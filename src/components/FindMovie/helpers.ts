import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

export const isResponseOk = (response: MovieData | ResponseError) => {
  if ('Error' in response) {
    return false;
  }

  return true;
};

export const normalizeMovieData = (movieData: MovieData) => {
  const {
    Poster: imgUrl,
    Title: title,
    Plot: description,
    imdbID: imdbId,
  } = movieData;

  const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

  const movie: Movie = {
    imgUrl,
    title,
    description,
    imdbId,
    imdbUrl,
  };

  if (movie.imgUrl === 'N/A') {
    movie.imgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }

  return movie;
};
