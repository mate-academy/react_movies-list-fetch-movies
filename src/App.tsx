import { useState } from 'react';
import './App.scss';

// Components
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

// Types
import { AddMovie } from './types/AddMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie: AddMovie = (findedMovie) => {
    if (findedMovie) {
      const alreadyAdded = movies.some(movie => movie.imdbID === findedMovie.imdbID);

      if (!alreadyAdded) {
        setMovies(currentMovies => [...currentMovies, findedMovie]);
      }
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
};
