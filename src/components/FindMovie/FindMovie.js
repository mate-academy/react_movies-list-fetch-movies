import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { request } from '../../helper';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState(null);

  const handleChange = (event) => {
    if (!event.target.value) {
      setError(true);
    }

    setTitle(event.target.value);
  };

  const handleSearch = async() => {
    if (!title) {
      setError(true);

      return false;
    }

    const searchedResult = await request(`&t=${title}`);

    if (searchedResult.Response === 'True') {
      return (
        setSearchedMovie({
          title: searchedResult.Title,
          description: searchedResult.Plot,
          imgUrl: searchedResult.Poster,
          imdbUrl: `https://www.imdb.com/title/${searchedResult.imdbID}/`,
          imdbId: searchedResult.imdbID,
        }),

        setTitle('')
      );
    }

    return (
      setError(true),
      setSearchedMovie(null)
    );
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

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={handleSearch}
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
                addMovie(searchedMovie);
                setSearchedMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {searchedMovie && <MovieCard {...searchedMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
