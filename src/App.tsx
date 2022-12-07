import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovie] = useState<(Movie | null)[]>([]);

  const addMovie = (movie: Movie | null) => {
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
