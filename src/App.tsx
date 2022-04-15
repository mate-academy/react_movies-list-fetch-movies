import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addNewMovie = (movie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.find(addMovie => addMovie.imdbID
        === movie.imdbID)) {
        return prevMovies;
      }

      return [movie, ...prevMovies];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNewMovie={addNewMovie} />
      </div>
    </div>
  );
};
