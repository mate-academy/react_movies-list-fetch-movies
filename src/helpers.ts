import { Movie, MovieData, ResponseError } from './types';

export function isMovieData(
  data: MovieData | ResponseError,
): data is MovieData {
  return 'imdbID' in data;
}

const noPosterImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';
const imdbBaseUrl = 'https://www.imdb.com/title/';

export function parseMovie(data: MovieData): Movie {
  const imgUrl = data.Poster !== 'N/A' ? data.Poster : noPosterImg;
  const imdbUrl = imdbBaseUrl + data.imdbID;

  return {
    title: data.Title,
    description: data.Plot,
    imgUrl,
    imdbUrl,
    imdbId: data.imdbID,
  };
}
