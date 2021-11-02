import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [moviesList, setMovieList] = useState<Movie[]>([]);

  const getMovie = (movie :Movie) => {
    if (moviesList.find((el: Movie) => el.imdbID === movie.imdbID)) {
      return;
    }

    if (movie.Title === '') {
      return;
    }

    setMovieList([...moviesList, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>
      <div className="sidebar">
        <FindMovie addToApp={getMovie} />
      </div>
    </div>
  );
};
