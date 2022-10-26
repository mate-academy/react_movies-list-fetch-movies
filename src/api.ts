import { ResponseError } from './types/ReponseError';
import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=dd901605';

export async function getMovie(query: string): Promise<Movie | ResponseError> {
  const response = await fetch(`${API_URL}&t=${query}`);
  const data = await response.json();

  if ('Title' in data) {
    const poster = data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster;

    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: poster,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    };
  }

  return data;
}
