import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie | undefined) => {
    if (!movie) {
      return;
    }

    const uniqMovieStatus = movies.some(
      item => item.imdbId === movie?.imdbId,
    );

    if (!uniqMovieStatus) {
      setMovies(prev => ([
        ...prev,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      {movies && (
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
      )}

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
