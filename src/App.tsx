import React, { useContext } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { StateContext } from './context/ReduxContex';

export const App = () => {
  const { saveMovies } = useContext(StateContext);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={saveMovies} />
      </div>

      <div className="sidebar">
        <FindMovie />
      </div>
    </div>
  );
};
