import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const noPoserUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function normalizeMovieData(data: MovieData): Movie {
  const movie: Movie = {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? noPoserUrl : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };

  // eslint-disable-next-line no-console
  console.log(movie);

  return movie;
}
