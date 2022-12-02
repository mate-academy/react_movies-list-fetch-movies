import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App: React.FC = () => {
  const [movies, setMovie] = useState<(MovieData | null)[]>([]);

  const addMovie = (movie: MovieData | null) => {
    setMovie(prevState => {
      if (prevState.find(newMovie => newMovie?.imdbID === movie?.imdbID)) {
        return prevState;
      }

      return [...prevState, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
