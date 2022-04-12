import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    setMovies(currMovies => {
      const alreadyInMovies = currMovies.some(currMovie => currMovie.imdbID
        === movie.imdbID);

      if (alreadyInMovies) {
        return currMovies;
      }

      return [...currMovies, movie];
    });
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
