import { FC, useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback(
    (newMovie: Movie) => {
      if (!movies.some(currMovie => currMovie.imdbID === newMovie.imdbID)) {
        setMovies([...movies, newMovie]);
      }
    }, [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
};
