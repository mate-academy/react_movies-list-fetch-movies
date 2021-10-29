import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC<{}> = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie): void => {
    const foundMovie = movies.every(({ imdbID }) => movie.imdbID !== imdbID);

    if (foundMovie) {
      setMovies(current => [...current, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAddMovie={addMovie}
        />
      </div>
    </div>
  );
};
