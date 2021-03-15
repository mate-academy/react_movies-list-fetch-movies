import React, { useState } from 'react';
import className from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movieFromServer';

export const FindMovie = ({ onAdd }) => {
  const [movie, setMovie] = useState({});
  const [inputValue, setInputValue] = useState('');

  const createNewMovie = () => {
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
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const setMovieEvent = () => {
    getMovie(inputValue)
      .then((res) => {
        setMovie(res);
      });
    setInputValue('');
  };

  const pressEnterEvent = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setMovieEvent();
    }
  };

  const newMovie = createNewMovie();
  const isSuccess = !Object.values(newMovie).includes(undefined);

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
                { 'is-danger': !isSuccess && Object.keys(movie).length > 0 },
                { 'is-primary': isSuccess },
              )}
              onChange={setInputValueEvent}
              onKeyDown={pressEnterEvent}
            />
          </div>

          {!isSuccess && Object.keys(movie).length > 0 && (
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
              onClick={(e) => {
                e.preventDefault();
                setMovieEvent();
              }}
              disabled={!inputValue.length}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={(e) => {
                e.preventDefault();
                onAdd(newMovie);
                setMovie({});
              }}
              disabled={!isSuccess}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isSuccess && (
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
