import { useContext } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { StateConstext } from './State/State';

export const App = () => {
  const { moviesList } = useContext(StateConstext);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>

      <div className="sidebar">
        <FindMovie />
      </div>
    </div>
  );
};
