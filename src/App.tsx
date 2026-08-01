import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { useState } from 'react';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [query, setQuery] = useState('Star Wars');

  const findMovie = (query: string) => {
    getMovie(query)
      .then(movie => {
        if (!movies.includes(movie)) {
          setMovies(prev => [...prev, movie]);
        }
      })
      .catch(() => setIsError(true));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie findMovie={findMovie} movies={movies} />
      </div>
    </div>
  );
};
