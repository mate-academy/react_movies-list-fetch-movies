import React from 'react';
// import { MoviesList } from './components/MoviesList';
// import { Movie } from './types/Movie';
import './App.scss';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  return (
    <div className="sidebar">
      <FindMovie />
    </div>
  );
};
