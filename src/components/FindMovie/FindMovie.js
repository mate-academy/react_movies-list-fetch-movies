import './FindMovie.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovieFromServer } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(false);

  const handleSubmit = async(query) => {
    const result = await getMovieFromServer(query);

    if (result.Response === 'False') {
      setError(true);
      setPreview(null);
    } else {
      setPreview({
        title: result.Title,
        description: result.Plot,
        imgUrl: result.Poster,
        imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        imdbId: result.imdbID,
      });

      setError(false);
    }
  };

  const handleChange = (event) => {
    setError(false);
    setTitle(event.target.value);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(title);
        }}
      >
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
              className={ClassNames(
                'input',
                { 'is-danger': error },
              )}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(preview);
                setTitle('');
                setPreview(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {preview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...preview} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
