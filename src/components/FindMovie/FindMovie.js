import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { request } from '../../api';

export const FindMovie = ({ onAdd }) => {
  const [movie, setMovie] = useState();
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onAdd(movie);
    setTitle('');
    setMovie(null);
  };

  const getMovie = async(query) => {
    const movieFromServer = await request(query);

    if (movieFromServer.Response === 'False') {
      setMovie(null);
      setError(true);

      return;
    }

    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Description,
      imdbUrl: movieFromServer.imdbUrl,
      imdbId: movieFromServer.imdbID,
      imgUrl: movieFromServer.Poster,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={handleChange}
              type="text"
              id="movie-title"
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
              onClick={() => getMovie(title)}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </div>
        )
      }
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
