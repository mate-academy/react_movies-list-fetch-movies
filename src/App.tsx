import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setNewMovies] = useState<Movie[]>([]);

  const setNewMoviesHandler = (newMovie: Movie) => {
    const hasListMovie = movies.some(movie => {
      return movie.imdbId === newMovie.imdbId;
    });

    if (hasListMovie) {
      return;
    }

    setNewMovies(prev => [...prev, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setNewMoviesHandler={setNewMoviesHandler}
        />
      </div>
    </div>
  );
};
