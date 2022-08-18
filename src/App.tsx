import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isInList, setIsInList] = useState(false);

  const addMovie = (movie: Movie) => {
    if (!movies.some(item => item.imdbId === movie.imdbId)) {
      setMovies(currentMovies => [...currentMovies, movie]);
    } else {
      setIsInList(true);
    }
  };

  const resetIsInList = () => {
    setIsInList(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={addMovie}
          isInList={isInList}
          resetIsInList={resetIsInList}
        />
      </div>
    </div>
  );
};
