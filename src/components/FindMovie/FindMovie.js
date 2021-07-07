import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getMoviesByTitle } from '../../api';
import movies from '../../api/movies.json';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(movies[0]);
  const [error, setError] = useState(false);

  const handleFind = async() => {
    const response = await getMoviesByTitle(searchTitle);

    if (response.Response === 'False') {
      setError(true);

      return;
    }

    setFoundMovie({
      title: response.Title,
      description: response.Plot,
      imgUrl: response.Poster,
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}/`,
      imdbId: response.imdbID,
    });
  };

  useEffect(() => {
    setError(false);
  }, [searchTitle]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleFind(searchTitle);
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
              value={searchTitle}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={(event) => {
                setSearchTitle(event.target.value.trimLeft());
              }}
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
              className="button is-light"
              onClick={handleFind}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(foundMovie);
                setSearchTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...foundMovie} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
