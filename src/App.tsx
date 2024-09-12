import { FormEvent, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { checkIsValidUrl } from './services/movie';

function getImageUrl(url: string): string {
  // eslint-disable-next-line
  const defaultPoster = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return checkIsValidUrl(url) ? url : defaultPoster;
}

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [query, setQuery] = useState('');

  const onSearchMovieSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getMovie(normalizedQuery);

      if (Object.hasOwn(response, 'Error')) {
        setIsNotFound(true);
        setQuery('');

        return;
      }

      const movieData = response as MovieData;
      const imgUrl = getImageUrl(movieData.Poster);
      const imdbUrl = `https://www.imdb.com/title/${movieData.imdbID}`;

      setFoundMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl,
        imdbUrl,
        imdbId: movieData.imdbID,
      });
    } catch {
      setIsNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewMovie = () => {
    if (!foundMovie) {
      return;
    }

    const isExistMovie = movies.some(
      movie => movie.imdbId === foundMovie.imdbId,
    );

    if (!isExistMovie) {
      setMovies([...movies, foundMovie]);
    }

    setQuery('');
    setFoundMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSubmit={onSearchMovieSubmit}
          onInputChange={(newQuery) => setQuery(newQuery)}
          queryValue={query}
          isLoading={isLoading}
          isNotFound={isNotFound}
          setIsNotFound={setIsNotFound}
          foundMovie={foundMovie}
          addNewMovie={addNewMovie}
        />
      </div>
    </div>
  );
};
