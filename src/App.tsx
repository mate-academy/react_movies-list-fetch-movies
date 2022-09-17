import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    const findMovie = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (!findMovie) {
      setMovie(prevMovie => [...prevMovie, newMovie]);
    }
  };

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
