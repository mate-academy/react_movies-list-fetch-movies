import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC<{}> = () => {
  const [movies, SetMovies] = useState<Movie[]>([]);

  const addMovie = (movieToAdd: Movie) => {
    const isMovieAlreadyAdded = movies.find(movie => movie.imdbID === movieToAdd.imdbID);

    if (!isMovieAlreadyAdded) {
      SetMovies(currentMovies => [...currentMovies, movieToAdd]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};
