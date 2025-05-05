import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const handleAdd = (movie: Movie) => {
    if (movies.some(newMovie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    setMovies([...movies, movie]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('savedMovies');

    if (saved) {
      const parsed = JSON.parse(saved);

      setMovies(parsed);
    }
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie query={query} onQueryChange={setQuery} onAdd={handleAdd} />
      </div>
    </div>
  );
};
