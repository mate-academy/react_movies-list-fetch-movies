import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const convertMovieDataToMovie = (movieData: MovieData): Movie => {
  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl:
      movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  };
};
