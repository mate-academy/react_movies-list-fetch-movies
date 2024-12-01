import { useContext } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { moviesContext } from './Store';

export const App = () => {
  const { movies } = useContext(moviesContext);

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
