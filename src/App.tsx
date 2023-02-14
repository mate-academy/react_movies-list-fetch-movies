import { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const addMovie = (movie: Movie) => {
    const index = movies.findIndex(v => v.imdbId === movie.imdbId);

    if (index !== -1) {
      return;
    }

    setMovies([
      ...movies,
      movie,
    ]);
  };

  const reset = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          searchText={query}
          setSearchText={setQuery}
          reset={reset}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
