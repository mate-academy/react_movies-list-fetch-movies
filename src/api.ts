import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=3bbe4f15';
const BASE_MOVIE_URL = 'https://www.imdb.com/title';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export function convertData(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster !== 'N/A'
      ? data.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `${BASE_MOVIE_URL}/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}
