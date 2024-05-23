import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const normalizeMovieData = (movieFromServer: MovieData): Movie => {
  const imgUrl =
    movieFromServer.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieFromServer.Poster;

  return {
    title: movieFromServer.Title,
    description: movieFromServer.Plot,
    imgUrl,
    imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
    imdbId: movieFromServer.imdbID,
  };
};
