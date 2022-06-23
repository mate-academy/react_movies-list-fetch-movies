import { useState } from 'react';

import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './react-app-env';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [dublikate, setDublikate] = useState(false);

  const addMove = (movie: Movie) => {
    const index: number = movies.findIndex((element: Movie) => (
      element.imdbID === movie.imdbID));

    if (index === (-1)) {
      setDublikate(false);
      setMovies((currentState: Movie[]) => {
        return [...currentState, { ...movie }];
      });
    } else {
      setDublikate(true);
    }
  };

  const resetError = () => {
    setDublikate(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMove={addMove}
          dublikate={dublikate}
          resetError={resetError}
        />
      </div>
    </div>
  );
};
