import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const setMovieToList = (movie: Movie) => {
    if (!movies.find(item => movie.imdbID === item.imdbID)) {
      setMovie((prev) => ([
        ...prev,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        {
          movies && <MoviesList movies={movies} />
        }
      </div>
      <div className="sidebar">
        <FindMovie
          setMovieToList={setMovieToList}
        />
      </div>
    </div>
  );
};
