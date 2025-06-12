import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const DEFAULT_PIC = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function normalizedMovieData(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? DEFAULT_PIC : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}
