import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { useContext } from 'react';
import { MovieContext } from './components/MovieContext/MovieContextProvider';

export const App = () => {
  const { movies } = useContext(MovieContext);

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
