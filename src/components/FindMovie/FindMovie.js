import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  const updateTitle = (newTitle) => {
    setTitle(newTitle);
    if (newTitle) {
      setError('');
    }
  };

  const findMovie = async() => {
    if (!title) {
      setMovie(null);
      setError('Not title entered');

      return;
    }

    const foundMovie = await getMovie(title);

    if (foundMovie.Error) {
      setError(foundMovie.Error);
      setMovie(null);

      return;
    }

    const newMovie = {
      title: foundMovie.Title,
      description: foundMovie.Plot,
      imgUrl: foundMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
      imdbId: foundMovie.imdbID,
    };

    setMovie(newMovie);
    setError('');
  };

  const addToList = () => {
    addMovie(movie);
    setTitle('');
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
              className={classnames('input', { 'is-danger': error.length > 0 })}
              value={title}
              onChange={e => updateTitle(e.target.value)}
            />
          </div>

          {error.length > 0
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && <h2 className="title">Preview</h2>}
        {movie && <MovieCard {...movie} />}
        {error && <div>{error}</div>}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
