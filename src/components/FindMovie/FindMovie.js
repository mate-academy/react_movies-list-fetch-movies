import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState({});
  const [nothingFound, setNothingFound] = useState(false);

  const onChange = (event) => {
    setQuery(event.target.value);
    setNothingFound(false);
  };

  const onClick = () => {
    getMovie(query)
      .then((movieFromServer) => {
        if (movieFromServer.Response === 'False') {
          setNothingFound(true);
          setMovie({});
        }

        setMovie({
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imdbId: movieFromServer.imdbID,
          imgUrl: movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
        });
      });

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
              className={`input ${nothingFound ? 'is-danger' : ''}`}
              value={query}
              onChange={onChange}
            />
          </div>

          <p
            className="help is-danger"
          >
            {nothingFound ? "Can't find a movie with such a title" : ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onClick}
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
                setMovie({});
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...movie} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
