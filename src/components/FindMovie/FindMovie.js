import React, { useState } from 'react';
import './FindMovie.scss';
import className from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/request';

export const FindMovie = ({ addMovie, isMovieInList }) => {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const loadData = async(query) => {
    if (query === '') {
      setError(true);
      setPreview('');
      setDisabled(true);

      return;
    }

    try {
      const newMovie = await getMovie(query);
      const film = {
        description: newMovie.Plot,
        imgUrl: newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
        title: newMovie.Title,
        imdbId: newMovie.imdbID,
      };

      setPreview(film);
      setDisabled(false);
    } catch (err) {
      setError(true);
      setDisabled(true);
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
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setPreview('');
                setError(false);
              }}
              placeholder="Enter a title to search"
              className={className('input', { 'is-danger': error })}
            />
          </div>
          {error && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
          {isMovieInList && (
          <p className="help is-danger">
            Movie is already in the list!
          </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={() => {
                loadData(input);
              }}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={disabled}
              onClick={() => {
                if (error) {
                  return;
                }

                addMovie(preview);
                setInput('');
                setPreview('');
                setDisabled(true);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {!error && preview
          ? (<MovieCard {...preview} />)
          : 'Search Movies'}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  isMovieInList: PropTypes.bool.isRequired,
};
