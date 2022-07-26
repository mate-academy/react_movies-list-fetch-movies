import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[] | null>(null);

  const addMovieHandler = (movie: Movie) => {
    if (movie !== null) {
      setMovies(prevState => {
        if (prevState === null) {
          return [movie];
        }

        if (prevState.some(film => film.Title === movie.Title)) {
          return prevState;
        }

        return [...prevState, movie];
      });
    }

    return null;
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovieHandler={addMovieHandler} />
      </div>
    </div>
  );
};
