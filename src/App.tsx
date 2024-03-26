import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddToList = (currentMovie: Movie) => {
    setMovies(currentmovies => {
      if (
        currentmovies.some(
          (movie: Movie) => movie.imdbId === currentMovie.imdbId,
        )
      ) {
        return currentmovies;
      }

      return [...currentmovies, currentMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddToList} />
      </div>
    </div>
  );
};
