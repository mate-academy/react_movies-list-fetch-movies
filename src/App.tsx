import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const hasSuchMovie = useCallback(({ title }: Movie, movieList: Movie[]) => {
    return movieList.some(movie => movie.title === title);
  }, []);

  const addMovie = useCallback(() => {
    if (newMovie && !hasSuchMovie(newMovie, movies)) {
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
