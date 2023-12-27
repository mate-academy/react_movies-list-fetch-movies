import { MovieData } from '../types/MovieData';

export const createMovieItem = (data: MovieData) => {
  const defImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster !== 'N/A' ? data.Poster : defImg,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
};
