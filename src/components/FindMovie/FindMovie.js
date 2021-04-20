import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { findMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [newMovie, setNewMovie] = useState();
  const [error, setError] = useState(false);
  const addToList = () => {
    addMovie(newMovie);
    setTitle('');
    setNewMovie();
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError(false);
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
              value={title}
              onChange={handleChange}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
            />
          </div>

          {error
          && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )
        }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie(title, setNewMovie, setError)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => newMovie && addToList()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie
        && (
        <MovieCard
          title={newMovie.Title}
          description={newMovie.Plot}
          imgUrl={newMovie.Poster}
          imdbUrl={`https://www.imdb.com/title/${newMovie.imdbID}`}
        />
        )
      }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
