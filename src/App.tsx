import React, { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [repeat, setRepeat] = useState(false);

  const addMovie = useCallback((movie) => {
    const inList = movies.find((item) => item.imdbID === movie.imdbID);

    if (!inList) {
      setMovies((list) => [...list, movie]);
    } else {
      setRepeat(true);
    }
  }, [movies]);

  const changeReapet = () => {
    setRepeat(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          repeat={repeat}
          changeRepeat={changeReapet}
        />
      </div>
    </div>
  );
};
