import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addFoundMovie = (movie: Movie) => {
    const foundMovie = movies
      .find(prevMovie => prevMovie.imdbId === movie.imdbId);

    if (!foundMovie) {
      setMovies(prevState => [...prevState, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addFoundMovie={addFoundMovie} />
      </div>
    </div>
  );
};
