import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const BASE_MOVIE_URL = 'https://www.imdb.com/title';

export function normalizeMovie(inputData: MovieData) {
  const { Title, Plot, imdbID } = inputData;
  let { Poster } = inputData;

  if (Poster === 'N/A') {
    Poster = '';
  }

  const movie: Movie = {
    title: Title,
    description: Plot,
    imdbId: imdbID,
    imdbUrl: `${BASE_MOVIE_URL}/${imdbID}`,
    imgUrl: Poster,
  };

  return movie;
}
