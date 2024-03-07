import { MovieData } from '../types/MovieData';

export function normalizeMovieData(movieData: MovieData) {
  const DEFAULT_PICTURE_URL =
    'https://via.placeholder.com/360x270.png?text=no%20preview';
  const IMDB_BASE_URL = 'https://www.imdb.com/title';
  const movieObject = {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A' ? DEFAULT_PICTURE_URL : movieData.Poster,
    imdbUrl: `${IMDB_BASE_URL}/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  };

  return movieObject;
}
