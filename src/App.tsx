import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | undefined>();
  const addMovie = (newMovie: Movie) => {
    if (!movies.find(m => m.imdbId === newMovie.imdbId)) {
      setMovies([...movies, newMovie]);
    }
  };

  const movieHandler = (newMovie: Movie | ResponseError | undefined) => {
    if (!newMovie) {
      setMovie(undefined);

      return;
    }

    if ('title' in newMovie) {
      setMovie(newMovie);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onFind={movieHandler} movie={movie} onAdd={addMovie} />
      </div>
    </div>
  );
};
