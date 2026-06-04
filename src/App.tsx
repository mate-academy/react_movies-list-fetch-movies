import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<MovieData | null>(null);

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setHasError(false);
  };

  const handleSearch = () => {
    if (!query) {
      return;
    }

    setIsLoading(true);

    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setFoundMovie(null);
          setHasError(true);

          return;
        }

        setFoundMovie(result);
        setHasError(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!foundMovie) {
      return;
    }

    const alreadyAdded = movies.some(
      movie => movie.imdbId === foundMovie.imdbID,
    );

    if (!alreadyAdded) {
      setMovies(currentMovies => [
        ...currentMovies,
        {
          title: foundMovie.Title,
          description: foundMovie.Plot,
          imgUrl:
            foundMovie.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : foundMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
          imdbId: foundMovie.imdbID,
        },
      ]);
    }

    setFoundMovie(null);
    setQuery('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
          foundMovie={foundMovie}
          hasError={hasError}
          isLoading={isLoading}
          onAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
