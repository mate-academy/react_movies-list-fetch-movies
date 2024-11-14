import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

export function normalizeMovieData(data: MovieData): Movie {
  return {
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster !== 'N/A' ? data.Poster : 'default_poster_url.jpg', // Replace with an actual default URL if desired
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  };
}
