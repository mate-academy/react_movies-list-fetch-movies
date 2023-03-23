import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=40cd6ae9';

// 'https://www.omdbapi.com/?apikey=40cd6ae9'

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export enum Error {
  Loading = 'Can&apos;t find a movie with such a title',
}

export const NormalizeMovieData = (movieData: MovieData): Movie => {
  return ({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  });
};
