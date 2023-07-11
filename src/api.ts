import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=cbef9849&t';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export const newMovie = (movieData: MovieData): Movie => {
  const {
    Title,
    Plot,
    Poster,
    imdbID,
  } = movieData;

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
};
