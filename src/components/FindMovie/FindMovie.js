import React, { useState } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState({});
  const [isMessageVisible, setVisibility] = useState(false);

  const { Title, Plot, Poster, imdbID } = movie;

  const handleSearch = () => {
    getMovie(query).then((movieFromServer) => {
      setMovie(movieFromServer);
      setVisibility(movieFromServer.Title === undefined);
    });
    setQuery('');
  };

  const handleAddition = () => {
    if (Title !== undefined) {
      addMovie(Title, Plot, Poster, imdbID);
    }

    setQuery('');
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
              className={
                classNames('input', {
                  'is-danger': isMessageVisible,
                })
              }
              value={query}
              onChange={event => setQuery(event.target.value)}
              onFocus={() => setVisibility(false)}
            />
          </div>

          {!isMessageVisible ? null
            : (
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
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddition}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        {!Title ? null
          : (
            <MovieCard
              title={Title}
              description={Plot}
              imgUrl={Poster}
              imdbUrl={`https://www.imdb.com/title/${imdbID}`}
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
