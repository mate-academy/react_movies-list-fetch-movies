import { FC, useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, addMovieToList] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    const isMovieAlreadyAdded = movies.some(({ imdbID }) => imdbID === movie.imdbID);

    if (!isMovieAlreadyAdded) {
      addMovieToList(currentMovies => [...currentMovies, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
