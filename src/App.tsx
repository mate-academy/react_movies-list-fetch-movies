import React, { useContext } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { StateContext } from './management/GlobalContextProvider';

export const App: React.FC = () => {
  const { movies } = useContext(StateContext);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie />
      </div>
    </div>
  );
};
