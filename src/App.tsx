import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);

  useEffect(() => {
    if (selectedMovie
      && !movies.some(movie => movie.imdbID === selectedMovie.imdbID)) {
      movies.push(selectedMovie);

      setMovies([...movies]);
    }
  }, [selectedMovie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setSelectedMovie={setSelectedMovie} />
      </div>
    </div>
  );
};
