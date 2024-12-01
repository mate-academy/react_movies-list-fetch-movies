import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export function getData(data: MovieData): Movie {
  const { Poster, Title, Plot, imdbID } = data;

  const defaultUrl =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? defaultUrl : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}
