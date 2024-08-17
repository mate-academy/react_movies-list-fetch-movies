import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function handleAddMovie(movie: Movie) {
    const isMovieAlreadyAdd = movies.find(
      ({ imdbId }) => imdbId === movie.imdbId,
    );

    if (!isMovieAlreadyAdd) {
      setMovies(prev => [...prev, movie]);
    }
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleAddMovie} />
      </div>
    </div>
  );
};
