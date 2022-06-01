import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    setMovies([...movies, movie]);
  };

  const isExist = (newMovie: Movie) => {
    return movies.some(movie => movie.imdbID === newMovie.imdbID);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies && (<MoviesList movies={movies} />)}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} isExist={isExist} />
      </div>
    </div>
  );
};
