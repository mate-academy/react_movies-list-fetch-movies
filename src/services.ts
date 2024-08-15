import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export function transformData(
  movieData: MovieData | ResponseError,
): Movie | null {
  function isResponseError(
    input: MovieData | ResponseError,
  ): input is ResponseError {
    return (input as ResponseError).Response === 'False';
  }

  if (!isResponseError(movieData)) {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  }

  return null;
}
