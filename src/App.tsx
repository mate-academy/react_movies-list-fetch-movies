import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = useCallback((movie: Movie) => {
    if (movies.some(movieFromList => movieFromList.imdbId === movie.imdbId)) {
      return;
    }

    setMovies(prevState => ([
      ...prevState,
      movie,
    ]));
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
