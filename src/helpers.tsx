import { MovieData } from './types/MovieData';

export const normalizeMovieData = (movieInfo: MovieData) => {
  const {
    Title,
    Plot,
    Poster,
    imdbID,
  } = movieInfo;

  const baseImdbUrl = 'https://www.imdb.com/title/';
  const defaultImgUrl = (
    'https://via.placeholder.com/360x270.png?text=no%20preview'
  );

  return ({
    title: Title,
    description: Plot,
    imgUrl: Poster !== 'N/A' ? Poster : defaultImgUrl,
    imdbUrl: `${baseImdbUrl}${imdbID}`,
    imdbId: imdbID,
  });
};
