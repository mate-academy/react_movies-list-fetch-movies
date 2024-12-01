import { useContext } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { StateContext } from './types/Store';

export const App = () => {
  const state = useContext(StateContext);
  const { movies } = state;

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
