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
        {moviesList.length > 0 && (
          <MoviesList moviesList={moviesList} />
        )}
      </div>

      <div className="sidebar">
        <FindMovie
          moviesList={moviesList}
          setMoviesList={setMoviesList}
        />
      </div>
    </div>
  );
};
