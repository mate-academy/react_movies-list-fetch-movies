import React, { useState } from 'react';
import './FindMovie.scss';
import Loader from 'react-loader-spinner';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getFilm } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [movieCard, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateInput = (event) => {
    if (error) {
      setError('');
    }

    setInput((event.target.value));
  };

  const getMovie = async() => {
    setIsLoading(true);

    const data = await getFilm(input);

    setIsLoading(false);

    if (data.Response === 'False') {
      setMovie(null);
      setError('Can`t find a movie with such a title');

      return;
    }

    setMovie({
      Title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    });

    setInput('');
    setError('');
  };

  const addMovie = () => {
    onAdd(movieCard);
    setMovie(null);
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
              className={classNames(
                'input',
                {
                  'is-danger': error,
                },
              )}
              value={input}
              onChange={event => updateInput(event)}
            />
          </div>
          {!movieCard && (
            <p className="help is-danger">
              {error}
            </p>
          )}
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
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          isLoading
            ? (
              <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
              />
            )
            : movieCard && <MovieCard {...movieCard} />
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
