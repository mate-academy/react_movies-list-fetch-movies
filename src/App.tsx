import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const moviesFromServer = (movie:Movie) => {
    setMovies([
      ...movies,
      movie,
    ]);
  };

  const isMoviesIncludes = (movie:Movie) => {
    return movies.some(elem => elem.imdbID === movie.imdbID);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={moviesFromServer}
          isMoviesIncludes={isMoviesIncludes}
        />
      </div>
    </div>
  );
};
