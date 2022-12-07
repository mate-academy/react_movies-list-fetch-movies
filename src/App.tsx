import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const hasSuchMovie = ({ title }: Movie, list: Movie[]) => {
    return list.some(movie => movie.title === title);
  };

  const AddMovie = () => {
    if (newMovie && !hasSuchMovie(newMovie, movies)) {
      setMovies((curr) => [...curr, newMovie]);
    }

    setNewMovie(null);
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
          setQuery={setQuery}
          addMovie={AddMovie}
          newMovie={newMovie}
          setNewMovie={setNewMovie}
        />
      </div>
    </div>
  );
};
