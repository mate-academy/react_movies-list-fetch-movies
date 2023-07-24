import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handlerAddMovie = (mov: Movie | null) => setMovies((currentMovies) => {
    const newMovies = [...currentMovies];

    if (mov && !newMovies.some(m => m.imdbId === mov.imdbId)) {
      newMovies.push(mov);
    }

    return newMovies;
  });

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={handlerAddMovie}
        />
      </div>
    </div>
  );
};
