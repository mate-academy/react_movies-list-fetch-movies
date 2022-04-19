import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    const isMovie = movies.find(movie => movie.imdbID === newMovie.imdbID);

    if (!isMovie) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
