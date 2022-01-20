/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMoviesFromServer } from '../../api/api';

type Props = {
  addMovie: (movie: Movie) => void | boolean;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setError] = useState('');

  const getMovie = async () => {
    try {
      const movieFromServer = await getMoviesFromServer(title);

      if (movieFromServer.Response === 'False') {
        throw new Error('Problem with downloading');
      }

      setMovie(movieFromServer);
    } catch (error) {
      setMovie(null);
      setError('Cant find a movie with such title');
    }
  };

  const chooseMovie = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const addToList = () => {
    if (movie) {
      if (addMovie(movie) === false) {
        setError('This movie is already on your list');
      }

      setTitle('');
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
                value={title}
                onChange={chooseMovie}
                className="input is-danger"
              />
            </div>
          </label>

          {errorMessage}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
              disabled={errorMessage.length > 0 || !title}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToList}
              disabled={errorMessage.length > 0 || !title}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
