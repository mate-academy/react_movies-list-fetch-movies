import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { MovieForm } from '../MovieForm';

type Props = {
  addMovie: (movieFromServer: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  const setCurrentMovie = (currentMovie: Movie | null) => {
    setMovie(currentMovie);
  };

  return (
    <>
      <MovieForm
        addMovie={addMovie}
        setCurrentMovie={setCurrentMovie}
        movies={movies}
        movie={movie}
      />
      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
