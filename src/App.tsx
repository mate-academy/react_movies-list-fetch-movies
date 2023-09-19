import './App.scss';

import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { MoviesProvider } from './components/store/MovieContext';

export const App = () => {
  return (
    <div className="page">
      <MoviesProvider>
        <div className="page-content">
          <MoviesList />
        </div>

        <div className="sidebar">
          <FindMovie />
        </div>
      </MoviesProvider>
    </div>
  );
};
