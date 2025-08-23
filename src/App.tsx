import { useState } from 'react';
import './App.scss';
import { MemoMoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movie: Movie) => {
    if (
      movies.findIndex(addedMovie => addedMovie.imdbId === movie.imdbId) === -1
    ) {
      setMovies(currentMovies => {
        return [...currentMovies, movie];
      });
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MemoMoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAddMovie} />
      </div>
    </div>
  );
};
