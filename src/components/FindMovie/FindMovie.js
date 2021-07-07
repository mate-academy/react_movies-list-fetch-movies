import React, { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState();
  const [query, setQuery] = useState('');
  const [loadingError, setLoadingError] = useState(false);

  const findMovie = async() => {
    const movieFromServer = await getMovie(query);

    if (movieFromServer.Response === 'True') {
      setMovie({
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster,
        imdbUrl: movieFromServer.imdbID,
      });
    } else {
      setMovie(undefined);
      setLoadingError(true);
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setLoadingError(false);
  };

  const sendMovie = () => {
    addMovie(movie);
    setMovie(undefined);
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
              onChange={handleChange}
              value={query}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn(
                'input', { 'is-danger': loadingError },
              )}
            />
          </div>

          {loadingError && (
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
              onClick={sendMovie}
              disabled={!movie}
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
