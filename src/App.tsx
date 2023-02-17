import { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const handleAddMovie = (newMovie: Movie) => {
    const isMovieInList = movies.some(({ imdbId }) => {
      return imdbId === newMovie.imdbId;
    });

    if (!isMovieInList) {
      setMovies((prevMovies) => [...prevMovies, newMovie]);
    }
  };

  const handleReset = useCallback(() => {
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
          onReset={handleReset}
          onAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
