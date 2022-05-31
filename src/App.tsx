import { FC, useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const isMovieInTheList = useCallback((movie: Movie) => {
    return movies.some(item => item.imdbID === movie.imdbID);
  }, [movies]);

  const addMovie = useCallback((movie: Movie) => {
    setMovies([...movies, movie]);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          isMovieInTheList={isMovieInTheList}
        />
      </div>
    </div>
  );
};
