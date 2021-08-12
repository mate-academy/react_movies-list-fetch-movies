import React, { useState } from 'react';
import classNames from 'classnames';
import propTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const SearchUrl = 'https://www.omdbapi.com/?apikey=7272b996&t=';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isMovieFound, setMovieStatus] = useState(true);

  const onChangeTitle = (event) => {
    const { value } = event.target;

    setMovieStatus(true);
    setTitle(value);
  };

  const findMovie = async(movieTitle) => {
    setLoading(true);
    const response = await fetch(`${SearchUrl}${movieTitle}`);

    if (!response.ok) {
      throw new Error('Error fetch');
    }

    const movieFromApi = await response.json();

    if (movieFromApi.Response === 'False') {
      setMovieStatus(false);
      clearForm();
      throw new Error('Can not find a film');
    }

    setMovie(createMovie(movieFromApi));
    clearForm();
  };

  const createMovie = (movieFromApi) => {
    const newMovie = {
      title: movieFromApi.Title,
      description: movieFromApi.Plot,
      imgUrl: movieFromApi.Poster,
      imdbUrl: movieFromApi.imdbID,
      imdbId: movieFromApi.imdbID,
    };

    return newMovie;
  };

  const clearForm = () => {
    setTitle('');
    setLoading(false);
  };

  const onSubmit = () => {
    addMovie(movie);
    clearForm();
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
              className={classNames('input', { 'is-danger': !isMovieFound })}
              value={isLoading ? 'Loading...' : title}
              onChange={onChangeTitle}
              disabled={isLoading}
            />
          </div>

          {!isMovieFound && (
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
              onClick={() => findMovie(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: propTypes.func.isRequired,
};
