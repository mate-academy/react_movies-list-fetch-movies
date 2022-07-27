import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './type/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    const foundedMovie = String(newMovie.Response) === 'True';

    if (foundedMovie) {
      setMovies([
        ...movies,
        newMovie,
      ]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} movies={movies} />
      </div>
    </div>
  );
};
