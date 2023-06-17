import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const defaultPictureUrl
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const createMovie = (data: MovieData): Movie => {
  const {
    Title,
    Poster,
    Plot,
    imdbID,
  } = data;
  const hasPoster = Poster !== 'N/A';
  const imdbUrl = `https://www.imdb.com/title/${imdbID}`;
  const imgUrl = hasPoster ? Poster : defaultPictureUrl;

  return {
    title: Title,
    description: Plot,
    imgUrl,
    imdbUrl,
    imdbId: imdbID,
  };
};
