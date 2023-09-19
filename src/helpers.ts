import { Movie, MovieData, ResponseError } from './types';

type ResponseData = MovieData | ResponseError;

export function isMovieData(data: ResponseData): data is MovieData {
  return 'imdbID' in data;
}

export function isResponseError(data: ResponseData): data is ResponseError {
  return 'Error' in data;
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
