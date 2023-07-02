import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [moviesList, setMoviesList] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>

      <div className="sidebar">
        <FindMovie
          setMoviesList={setMoviesList}
          moviesList={moviesList}
        />
      </div>
    </div>
  );
};
