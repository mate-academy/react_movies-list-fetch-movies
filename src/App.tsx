import { useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addFilm = (film: Movie) => {
    if (movies.every(movie => movie.imdbID !== film.imdbID)) {
      setMovies([...movies, film]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addFilm={addFilm} />
      </div>
    </div>
  );
};
