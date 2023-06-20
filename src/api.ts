import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=d049b4a';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export const normalizeMovie = (m: MovieData): Movie => {
  const imdbUrl = m.imdbID
    ? `https://www.imdb.com/title/${m.imdbID}/`
    : 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return {
    title: m.Title,
    description: m.Plot,
    imgUrl: m.Poster,
    imdbUrl,
    imdbId: m.imdbID,
  };
};
