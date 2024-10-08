import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=62b3e6a9';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export const normaliseMovie = (searchedMovie: MovieData): Movie => {
  const defaulImg = () => {
    if (searchedMovie.Poster === 'N/A') {
      return `https://via.placeholder.com/360x270.png?text=no%20preview`;
    }

    return searchedMovie.Poster;
  };

  return {
    title: searchedMovie.Title,
    description: searchedMovie.Plot,
    imgUrl: defaulImg(),
    imdbUrl: `https://www.imdb.com/title/${searchedMovie.imdbID}`,
    imdbId: searchedMovie.imdbID,
  };
};
