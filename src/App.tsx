import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const addMovies = () => {
    if (foundMovie) {
      const movieInList = movies
        .find(currentMovie => currentMovie.imdbId === foundMovie.imdbId);

      if (!movieInList) {
        setMovies([...movies, foundMovie]);
      }
    }

    setFoundMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={foundMovie}
          setFoundMovie={setFoundMovie}
          addMovies={addMovies}
        />
      </div>
    </div>
  );
};
