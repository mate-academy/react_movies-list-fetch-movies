import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    setMovies((currentMovies: Movie[]) => {
      if (currentMovies.find(({ imdbId }) => imdbId === newMovie.imdbId)) {
        return currentMovies;
      }

      return [...currentMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovies={handleAddMovie} />
      </div>
    </div>
  );
};
