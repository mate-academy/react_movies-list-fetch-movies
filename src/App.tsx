import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (movie: Movie): void => {
    const isUnique = movies.every(({ imdbID }) => movie.imdbID !== imdbID);

    if (isUnique) {
      setMovies(current => [...current, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie onMovieAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
