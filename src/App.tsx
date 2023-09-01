import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMovieAdd = (foundMovie: Movie) => {
    const isExists = movies.some(({ imdbId }) => foundMovie.imdbId === imdbId);

    if (!isExists) {
      setMovies([...movies, foundMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onMovieAdd={onMovieAdd}
        />
      </div>
    </div>
  );
};
