import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (!movies.some(currMovie => currMovie.imdbID === movie.imdbID)) {
      setMovies([...movies, movie]);
    }
  };

  const checkMovie = movies.length !== 0;

  return (
    <div className="page">
      <div className="page-content">
        {checkMovie && (
          <MoviesList movies={movies} />
        )}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
