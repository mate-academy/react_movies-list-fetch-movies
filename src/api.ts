import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = 'f73f839a';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(response => response.json())
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error, please try again!',
    }));
}

export function getMovieData(movieData: MovieData): Movie {
  const posterUrl = movieData.Poster !== 'N/A'
    ? movieData.Poster
    : 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const movie = {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: posterUrl,
    imdbId: movieData.imdbID,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
  };

  return movie;
}
