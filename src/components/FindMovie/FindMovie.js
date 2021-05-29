import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovieFromApi } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [movieIsFound, setMovieIsFound] = useState(true);

  const getMovie = async() => {
    const data = await getMovieFromApi(value);

    if (data.Response === 'False') {
      setMovieIsFound(false);
      setMovie(null);

      return;
    }

    setMovie({
      title: data.Title,
      description: data.Plot,
      imdbId: data.imdbID,
      imgUrl: data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    });
    setMovieIsFound(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setValue('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={value}
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': !movieIsFound,
              })}
              onChange={(event) => {
                setValue(event.target.value);
                setMovieIsFound(true);
              }}
            />
          </div>
          {!movieIsFound
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames({
                button: true,
                'is-light': !movieIsFound,
              })}
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className={classNames({
                button: true,
                'is-primary': movie,
              })}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
