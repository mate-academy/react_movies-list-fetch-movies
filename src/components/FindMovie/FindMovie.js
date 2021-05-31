import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMoviesFromApi } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [foundMovie, setFound] = useState(false);

  const getMovie = async() => {
    const data = await getMoviesFromApi(value);

    if (data.Response === 'False') {
      setMovie(null);
      setFound(false);
    }

    setMovie({
      title: data.Title,
      description: data.Plot,
      imdbId: data.imdbID,
      imgUrl: data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    });

    setFound(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setValue('');
      setMovie(null);
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
              className="input is-danger"
              onChange={(event) => {
                setValue(event.target.value);
                setFound(true);
              }}
            />
          </div>
          {!foundMovie && (
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
              onClick={getMovie}
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
      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
