import { FC } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MoviesProvider } from './components/MoviesContext';

export const App: FC = () => {
  return (
    <MoviesProvider>
      <div className="page">
        <div className="page-content">
          <MoviesList />
        </div>
        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
    </MoviesProvider>
  );
};
