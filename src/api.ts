import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=5f7fced8';

function fetchMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch((error: ResponseError) => error.Response);
}

export async function getMovie(query: string) {
  const movieFromServer = await fetchMovie(query);

  if ('imdbID' in movieFromServer) {
    const url
    = `https://www.imdb.com/title/${movieFromServer.imdbID}`;
    const img = movieFromServer.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieFromServer.Poster;

    const makeMovie: Movie = {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: img,
      imdbUrl: url,
      imdbId: movieFromServer.imdbID,
    };

    return makeMovie;
  }

  throw new Error(movieFromServer.Error);
}
