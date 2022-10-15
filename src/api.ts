import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=dd901605';

export async function getMovie(query: string): Promise<Movie | ResponseError> {
  const response: MovieData | ResponseError = await fetch(`${API_URL}&t=${query}`)
    .then(res => res.json());

  if ('Title' in response) {
    const poster = response.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : response.Poster;
    const movie = {
      title: response.Title,
      description: response.Plot,
      imgUrl: poster,
      imdbId: response.imdbID,
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
    };

    return movie;
  }

  return response;
}
