import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=a179fb4';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export const getMovieCard = async (query: string): Promise<Movie | null> => {
  const movie = await getMovie(query);

  if ('Title' in movie && 'Plot' in movie && 'Poster' in movie
    && 'imdbID' in movie) {
    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movie;

    const imgUrl = Poster !== 'N/A'
      ? Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview';

    return Promise.resolve({
      title: Title,
      description: Plot,
      imgUrl,
      imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
      imdbId: imdbID,
    });
  }

  return null;
};
