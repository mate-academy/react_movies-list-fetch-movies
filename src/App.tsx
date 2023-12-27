import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMuvies] = useState<Movie[]>([]);

  const verifyMuvies = (muvi: Movie) => {
    const verify = movies.some(muv => muv.imdbId === muvi.imdbId);

    if (!verify) {
      setMuvies((prev) => [...prev, muvi]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setMuvies={verifyMuvies}
        />
      </div>
    </div>
  );
};
