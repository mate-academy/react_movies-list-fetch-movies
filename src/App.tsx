import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isRepeat, setRepeat] = useState(false);

  const addMovie = (newMovie: Movie) => {
    const check = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (check === undefined) {
      setMovies([...movies, newMovie]);
      setRepeat(false);
    } else {
      setRepeat(true);
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
        <FindMovie
          addMovie={addMovie}
          isRepeat={isRepeat}
          setRepeat={setRepeat}
        />
      </div>
    </div>
  );
};
