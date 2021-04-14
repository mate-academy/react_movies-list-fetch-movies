import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import movies from './api/movies.json';

export const App = () => {
  const [mov, setMovies] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    setMovies([...movies]);
  }, []);

  const addMovieHandler = useCallback((movie) => {
    if (
      movie.imdbID !== undefined
      && !mov.some(m => m.imdbId === movie.imdbID)
    ) {
      setMovies([
        ...mov,
        {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: movie.Website,
          imdbId: movie.imdbID,
        },
      ]);

      setIsAdd(true);
      setIsDuplicate(false);
    } else {
      setIsDuplicate(true);
    }
  }, [mov]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={mov} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieHandler={addMovieHandler}
          isDuplicate={isDuplicate}
          setIsDuplicate={setIsDuplicate}
          isAdd={isAdd}
          setIsAdd={setIsAdd}
        />
      </div>
    </div>
  );
};
