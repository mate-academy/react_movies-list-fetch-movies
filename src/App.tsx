import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const checkMovieRepeat = useCallback((id: string) => {
    return movies.some(movie => movie.imdbID === id);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          setMovies={setMovies}
          checkMovieRepeat={checkMovieRepeat}
        />
      </div>
    </div>
  );
};
