import { FC } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => (
  <div className="page">
    <div className="page-content">
      <MoviesList />
    </div>

    <div className="sidebar">
      <FindMovie />
    </div>
  </div>
);
