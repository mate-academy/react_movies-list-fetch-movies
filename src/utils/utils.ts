import { MovieData } from '../types/MovieData';

export const defaultImgUrl =
  'https://via.placeholder.com/360x270.png?text=no%20preview';
export const notImage = 'N/A';

export const formatMovie = (data: MovieData) => {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
};
