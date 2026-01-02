import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const transformMovieData = (data: MovieData): Movie => {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
};
