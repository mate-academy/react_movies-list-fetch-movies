import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddedMovie = (movie: Movie) => {
    if (movies.find(film => film.imdbId === movie.imdbId)) {
      return;
    }

    setMovies(currentMovies => [...currentMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={(movie) => handleAddedMovie(movie)} />
      </div>
    </div>
  );
};
