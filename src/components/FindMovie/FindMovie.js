import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({
  addNewMovie,
  duplicate,
  deleteDuplicateMessage,
}) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');
  const [entered, setEntered] = useState(false);
  const [messageDuplicate, setMessageDuplicate] = useState(false);

  useEffect(() => {
    setMessageDuplicate(duplicate);
  });

  const checkForMovie = (film) => {
    if (film && !film.Error) {
      setEntered(false);
    } else {
      setEntered(true);
    }

    if (duplicate) {
      deleteDuplicateMessage();
    }
  };

  const onFindMovie = async() => {
    const result = await getMovie(value);

    setMovie(result);

    checkForMovie(movie);
  };

  const onAddMovie = () => {
    if (movie && !movie.Error) {
      addNewMovie(movie);
    }

    setValue('');
    setMovie('');
    checkForMovie(movie);
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
              placeholder={entered
                ? 'The input field must be filled'
                : 'Enter a title to search'
              }
              className="input is-danger"
              value={value}
              onChange={({ target }) => {
                setValue(target.value);
                setEntered(false);
                deleteDuplicateMessage();
              }}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}

            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie === '' || movie.Error ? (
        <>
          <p className="help is-danger">
            {movie.Error
              ? 'Can\'t find a movie with such a title'
              : ''
          }
          </p>

          <p className="help is-danger">
            {entered && !movie.Error
              ? 'Find the movie first'
              : ''
        }
          </p>
        </>
      ) : (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
      {messageDuplicate && (
        <p className="help is-danger">
          This movie cannot be added to the list because it has already there
        </p>
      )}

    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
  duplicate: PropTypes.bool.isRequired,
  deleteDuplicateMessage: PropTypes.func.isRequired,
};
