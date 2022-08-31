import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isRepeat, setIsRepeat] = useState(false);

  const handleMovieAdd = (newMovie: Movie) => {
    const isMatchMovie = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (isMatchMovie) {
      setIsRepeat(true);

      return;
    }

    setMovies(prevMovies => [...prevMovies, newMovie]);
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
          onMovieAdd={handleMovieAdd}
          isRepeat={isRepeat}
          setIsRepeat={setIsRepeat}
        />
      </div>
    </div>
  );
};
