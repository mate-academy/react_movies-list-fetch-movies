import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const checkHasSuchMovie = useCallback(({ title }: Movie) => (
    movies.some(movie => movie.title === title)
  ), [movies]);

  const addMovie = useCallback(() => {
    if (newMovie && !checkHasSuchMovie(newMovie)) {
      setMovies((current) => [...current, newMovie]);
    }

    setNewMovie(null);
    setQuery('');
  }, [movies, newMovie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          addMovie={addMovie}
          newMovie={newMovie}
          setNewMovie={setNewMovie}
        />
      </div>
    </div>
  );
};
