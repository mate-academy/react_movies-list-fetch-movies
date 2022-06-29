import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [title] = useState('as');

  // useEffect(
  //   () => {
  //     getMovie(title).then((response: Movie[]) => setMovies(response));
  //   },
  //   [],
  // );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie movies={movies} setMovies={setMovies} />
      </div>
    </div>
  );
};
