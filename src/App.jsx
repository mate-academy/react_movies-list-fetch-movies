import React from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => (
  <div className="page">
    <div className="page-content">
      <MoviesList movies={data} />
    </div>
    <div className="sidebar">
      <FindMovie />
    </div>
  </div>
);
