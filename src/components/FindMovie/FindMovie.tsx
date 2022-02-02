import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasMovieError, setHasMovieError] = useState(false);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(e.target.value);
    setHasMovieError(false);
  };

  const handleFindMovie = async () => {
    if (!movieTitle) {
      return;
    }

    const newMovie = await getMovie(movieTitle);

    if (!newMovie.Title) {
      setHasMovieError(true);
      setMovie(null);

      return;
    }

    setMovie(newMovie);
    setHasMovieError(false);
  };

  const checkMovie = (newMovie: Movie) => {
    const findedMovie = movies.find(oldMovie => oldMovie.imdbID === newMovie.imdbID);

    if (!findedMovie) {
      return true;
    }

    return false;
  };

  const handleClickSubmit = () => {
    if (movie && checkMovie(movie)) {
      addMovie(movie);
      setMovieTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={movieTitle}
                onChange={handleChangeTitle}
              />
            </div>
          </label>

          {hasMovieError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClickSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
