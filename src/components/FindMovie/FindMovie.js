import React, { useState } from 'react';
import className from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movieFromServer';

export const FindMovie = ({ onAdd }) => {
  const [movie, setMovie] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isNotASuccess, setIsSuccess] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  const createNewMovie = () => {
    if (Object.keys(movie).includes('Error') || !Object.keys(movie).length) {
      return {};
    }

    const { Title, Plot, Poster, imdbID } = movie;

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };
  };

  const setInputValueEvent = (e) => {
    setInputValue(e.target.value);
    setIsSuccess(false);
  };

  const setMovieEvent = (e) => {
    e.preventDefault();
    getMovie(inputValue)
      .then((res) => {
        if (!JSON.parse(res.Response.toLowerCase())) {
          setIsSuccess(true);
          setDisabled(true);
        } else {
          setDisabled(false);
        }

        setMovie(res);
      });
    setInputValue('');
  };

  const newMovie = createNewMovie();

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
              value={inputValue}
              className={className(
                'input',
                { 'is-danger': isNotASuccess },
                { 'is-primary': !isNotASuccess },
              )}
              onChange={setInputValueEvent}
            />
          </div>

          {isNotASuccess && (
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
              onClick={setMovieEvent}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={(e) => {
                onAdd(e, newMovie);
                setMovie({});
                setDisabled(true);
              }}
              disabled={isDisabled}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {Object.keys(newMovie).length > 0 && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
