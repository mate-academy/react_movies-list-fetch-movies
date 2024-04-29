import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleNewFilf = (movie: Movie) => {
    const isExist = movies.find(film => film.imdbId === movie.imdbId);

    if (isExist) {
      return;
    }

    setMovies(prevState => [...prevState, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleNewFilf} />
      </div>
    </div>
  );
};
