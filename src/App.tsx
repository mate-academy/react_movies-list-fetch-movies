import { useContext } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieContext } from './components/Store/Store';

export const App = () => {
  const { moviesList } = useContext(MovieContext);

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
