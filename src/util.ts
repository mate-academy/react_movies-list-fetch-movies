import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

export function parseData(movieData: MovieData): Movie {
  const DEFAULT_PICTURE_URL
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return ({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A' ? DEFAULT_PICTURE_URL : movieData.Poster,
    imdbId: movieData.imdbID,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
  });
}
