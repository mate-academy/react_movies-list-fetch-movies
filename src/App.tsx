import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieOnTheList, setIsMovieOnTheList] = useState<boolean>(false);

  const addMovie = (anotherMovie: Movie) => {
    const moviesCopy: Movie[] = [...movies];

    if (!moviesCopy.some((movie: Movie) => movie.imdbID === anotherMovie.imdbID)) {
      moviesCopy.push(anotherMovie);

      setMovies(moviesCopy);
    } else {
      setIsMovieOnTheList(true);
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
          isMovieOnTheList={isMovieOnTheList}
          setIsMovieOnTheList={setIsMovieOnTheList}
        />
      </div>
    </div>
  );
};
