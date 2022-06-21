import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { FindMovieForm } from '../FindMovieForm';

interface Props {
  setMoviesFSState: (arg: Movie[], arg2: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ setMoviesFSState, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sameMovie, setSameMovie] = useState(false);

  return (
    <>
      <FindMovieForm
        setMoviesFSState={setMoviesFSState}
        movies={movies}
        setSameMovie={setSameMovie}
        setMovie={setMovie}
        movie={movie}
      />

      <div className="container">
        <h2 className="title">Preview</h2>
        {sameMovie && (
          <p
            className="has-text-danger mb-5"
          >
            This movie is alredy exist in your library
          </p>
        )}

        {movie && <MovieCard movie={movie} />}

      </div>
    </>
  );
};
