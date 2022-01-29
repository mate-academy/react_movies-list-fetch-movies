/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { getMovieFromServer } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  add: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ add }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setError] = useState('');

  const getMovie = async () => {
    try {
      const movieServer = await getMovieFromServer(title);

      setMovie(movieServer);
    } catch (error) {
      setMovie(null);
      setError('Cant find a movie with such title');
    }
  };

  const AddMovie = () => {
    if (movie) {
      add(movie);

      setMovie(null);
      setTitle('');
    } else {
      setError('Problem with adding movie');
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input is-danger"
            />
          </div>

          <p className="help is-danger">
            {errorMessage}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={AddMovie}
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
