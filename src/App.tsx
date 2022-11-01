import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieInTheList, setIsMovieInTheList] = useState(false);

  const addMovie = (movie: Movie) => {
    if (movies.every(movieInList => movieInList.imdbId !== movie.imdbId)) {
      setMovies(currentMovies => [
        ...currentMovies,
        movie,
      ]);
    } else {
      setIsMovieInTheList(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          isMovieInTheList={isMovieInTheList}
        />
      </div>
    </div>
  );
};
