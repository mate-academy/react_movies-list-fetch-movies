import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const handleAddMovie = () => {
    if (newMovie) {
      setMovies(prev => [...prev, newMovie]);
      setNewMovie(null);
      setQuery('');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          findMovie={setNewMovie}
          newMovie={newMovie}
          onAddMovie={handleAddMovie}
          query={query}
          setQuery={setQuery}
        />
      </div>
    </div>
  );
};
