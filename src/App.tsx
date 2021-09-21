import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    setMovies((currentMovie => {
      const isNewMovie = currentMovie.find(movie => movie.imdbID === newMovie.imdbID);

      if (!isNewMovie) {
        return [...currentMovie, newMovie];
      }

      return [...currentMovie];
    }));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
