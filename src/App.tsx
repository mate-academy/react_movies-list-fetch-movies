import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const emptyMovie = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };

  const [movies] = useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = useState<Movie>(emptyMovie);

  const getNewMovie = () => {
    movies.push(foundMovie);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          getNewMovie={getNewMovie}
          foundMovie={foundMovie}
          setFoundMovie={setFoundMovie}
          emptyMovie={emptyMovie}
        />
      </div>
    </div>
  );
};
