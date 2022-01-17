/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api/getMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieFound, setIsMovieFound] = useState(true);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const searchMovieTitle = async (title: string) => {
    try {
      const movie = await getMovie(title);

      if (movie.Response === 'True') {
        setFoundMovie(movie);
        setIsMovieFound(true);
      } else {
        setIsMovieFound(false);
      }
    } catch (error) {
      console.log('An error has occurred', error);
    }
  };

  const addToList = () => {
    if (!foundMovie) {
      return;
    }

    if (movies.find(movie => movie.imdbID === foundMovie.imdbID)) {
      return;
    }

    setMovies([...movies, foundMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          searchMovie={searchMovieTitle}
          isMovieFound={isMovieFound}
          foundedMovie={foundMovie}
          addToList={addToList}
        />
      </div>
    </div>
  );
};
