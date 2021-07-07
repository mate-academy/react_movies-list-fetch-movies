import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [movieFromApi, setMovieFromApi] = useState('');
  const [error, setError] = useState(false);
  const [warn, setWarn] = useState(false);
  const movieToAdd = {
    title: movieFromApi.Title,
    description: movieFromApi.Plot,
    imgUrl: movieFromApi.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}/`,
    imdbId: movieFromApi.imdbID,
  };

  const addMovieWithBenefits = () => {
    setQuery('');
    setMovieFromApi('');
    addMovie([
      ...movies,
      movieToAdd,
    ]);
  };

  const addHandler = () => {
    if (!movies.some(movie => movieFromApi.imdbID === movie.imdbId)
    && movieFromApi.Response === 'True') {
      addMovieWithBenefits();
    } else {
      setWarn(true);
      setError(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input${error || warn ? ' is-danger' : ''}`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
                setWarn(false);
                setMovieFromApi('');
              }}
            />
          </div>
          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {warn && (
            <p className="help is-danger">
              {
                movieFromApi.Response === 'True'
                  ? `It's already in the list`
                  : 'Nothing to add'
              }
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={() => {
                getMovie(query)
                  .then((result) => {
                    setMovieFromApi({ ...result });
                    setWarn(false);
                    setError(result.Response !== 'True');
                  });
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addHandler()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieFromApi.Response === 'True' && (
          <MovieCard {...movieToAdd} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
  addMovie: PropTypes.func.isRequired,
};
