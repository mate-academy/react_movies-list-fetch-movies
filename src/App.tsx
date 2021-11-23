import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovieList] = useState<Movie[]>([]);

  const isMovieInList = (movie: Movie) => {
    const couldGetMovie = movie && movies.find(currMovie => currMovie.imdbID === movie.imdbID);

    if (!couldGetMovie) {
      setMovieList(prevMovies => [...prevMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie setMovieList={isMovieInList} />
      </div>
    </div>
  );
};
