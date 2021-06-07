import React, { useState } from 'react';
import './FindMovie.scss';

import cNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';

export const FindMovie = ({ onAdd }) => {
  const [searchError, setSearchError] = useState(false);
  const [title, setTitile] = useState('');
  const [movie, setMovie] = useState(null);

  const searchMovie = async() => {
    const findMovie = await getFilm(title);

    if (findMovie.Response !== 'True') {
      setSearchError(true);
      setTitile('');
      setMovie(null);

      return;
    }

    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = findMovie;

    const newMovie = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbID,
    };

    setMovie(newMovie);
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
              className={cNames('input', {
                'is-danger': searchError,
              })}
              value={title}
              onChange={({ target }) => {
                setTitile(target.value);
                setSearchError(false);
              }}
            />
          </div>

          {searchError && (
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                onAdd(movie);
                setMovie(null);
                setTitile('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
