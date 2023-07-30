/* eslint-disable no-console */
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieProvider } from './context/movieContext';

export const App = () => {
  return (
    <MovieProvider>
      <div className="page">
        <div className="page-content">
          <MoviesList />
        </div>

        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
    </MovieProvider>
  );
};
