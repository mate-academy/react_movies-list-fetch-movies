import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMatches, setIsMatches] = useState(false);

  const addMovies = (film: Movie | null) => {
    if (film?.Response === 'True') {
      const result = movies.some((movie) => movie.imdbID === film.imdbID);

      if (!result) {
        setMovies([...movies, film]);
        setIsMatches(false);
      } else {
        setIsMatches(true);
      }
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovies={addMovies}
          isMatches={isMatches}
          setIsMatches={setIsMatches}
        />
      </div>
    </div>
  );
};
