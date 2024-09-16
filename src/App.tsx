import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [query, setQuery] = useState('');

  const handleSearchMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddMovie = (newMovie: Movie) => {
    setQuery('');
    if (!movies.some(({ imdbId }) => newMovie.imdbId === imdbId)) {
      setMovies((prev) => [...prev, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onSearch={handleSearchMovie}
          onAdd={handleAddMovie}
        />
      </div>
    </div>
  );
};
