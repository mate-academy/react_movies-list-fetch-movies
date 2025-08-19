import { MovieData } from './types/MovieData';
import { Movie } from './types/Movie';

const API_KEY = '6f5e6816';
const API_URL = 'https://www.omdbapi.com/';

function convertToMovie(movieData: MovieData): Movie {
  const defaultImage =
    'https://via.placeholder.com/360x270.png?text=no%20preview';
  const imgUrl =
    movieData.Poster === 'N/A' || !movieData.Poster
      ? defaultImage
      : movieData.Poster;

  return {
    imdbId: movieData.imdbID,
    title: movieData.Title,
    description:
      movieData.Plot || `${movieData.Year} - ${movieData.Genre || 'Movie'}`,
    imgUrl,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
  };
}

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(
    `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`,
  );

  if (!response.ok) {
    throw new Error('Network error');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'unexpected error');
  }

  const movieData = data as MovieData;

  return convertToMovie(movieData);
}

export async function searchMovies(keyword: string): Promise<MovieData[]> {
  const response = await fetch(
    `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(keyword)}`,
  );
  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'unexpected error');
  }

  return data.Search as MovieData[];
}
