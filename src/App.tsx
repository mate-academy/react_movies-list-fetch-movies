import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, addMovieToList] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (!movies.some(({ imdbID }) => imdbID === movie.imdbID)) {
      addMovieToList(currentMovies => [...currentMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
