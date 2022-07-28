import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const picture = 'https://via.placeholder.com/360x270.png';

export function convertMovie(film: MovieData): Movie {
  const {
    Title: title,
    Plot: description,
    imdbID: imdbId,
    Poster: imgUrl,
  } = film;

  return {
    title,
    description,
    imdbId,
    imgUrl: imgUrl === 'N/A'
      ? picture
      : imgUrl,
    // eslint-disable-next-line
    imdbUrl: 'https://www.imdb.com/title/' + imdbId,
  };
}

export function convertQuery(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[\s]/gi, '+');
}
