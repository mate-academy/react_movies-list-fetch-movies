import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [moviesList, setMovies] = useState([]);

  return (
    <div className="page">
      <div className="page-content">
        {
          moviesList.length === 0
            ? (<h1>Add your movies here</h1>)
            : <MoviesList movies={moviesList} />
        }
      </div>
      <div className="sidebar">
        <FindMovie setMovies={setMovies} moviesList={moviesList} />
      </div>
    </div>
  );
};
