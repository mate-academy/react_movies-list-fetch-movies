import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (currentMovie: Movie) => {
    if (movies.find(
      currentFilm => currentFilm.imdbId === currentMovie.imdbId,
    )) {
      return;
    }

    setMovies(currentMovies => [...currentMovies, currentMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={(movie) => handleAddMovie(movie)} />
      </div>
    </div>
  );
};
