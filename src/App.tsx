import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieAdded, setMovieAdded] = useState<boolean>(false);

  const isMovieInList = (movieId: string): boolean => movies
    .some(movieFromList => movieFromList.imdbID === movieId);

  const addMovie = (movie: Movie) => {
    if (!isMovieInList(movie.imdbID)) {
      setMovies([...movies, movie]);
      setMovieAdded(false);
    }

    if (isMovieInList(movie.imdbID)) {
      setMovies([...movies]);
      setMovieAdded(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} movieAdded={movieAdded} />
      </div>
    </div>
  );
};
