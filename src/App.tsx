import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, addMovie] = useState<Movie[]>([]);

  const onMovieAdd = (movie: Movie) => {
    const isMovieExisting = movies
      .some(existingMovie => existingMovie.title === movie.title);

    if (!isMovieExisting) {
      addMovie(prevMovies => [...prevMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={onMovieAdd} />
      </div>
    </div>
  );
};
