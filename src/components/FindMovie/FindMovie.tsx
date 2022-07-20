import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

const URL = `https://www.omdbapi.com/?apikey=7272b996`;

export const FindMovie = ({ onAddMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundedMovie, setFoundedMovie] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [movieTitle]);

  const searchMovie = async() => {
    setIsLoading(true);
    setIsError(false);

    fetch(`${URL}&t=${movieTitle}`)
      .then(response => response.json())
      .then((result) => {
        if (result.Error) {
          setIsError(true);
        } else {
          setFoundedMovie(result);
        }
      })
      .catch((error) => {
        setIsError(true);
        throw new Error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    onAddMovie(foundedMovie);
    setMovieTitle('');
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
              className={classnames('input',
                { 'is-danger': isError })}
              value={movieTitle}
              onChange={event => setMovieTitle(event.target.value)}
            />
          </div>

          {isError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isLoading && (
            <p className="help">
              Searching...
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              disabled={!foundedMovie}
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundedMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...foundedMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
