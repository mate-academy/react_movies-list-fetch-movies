import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=de242cb8&t=';

export const FindMovie = ({ handleAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({});
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorMovie, setErrorMovie] = useState(false);

  function handleChange(event) {
    const { value } = event.target;

    setErrorTitle(false);
    setErrorMovie(false);
    setMovie({});
    setTitle(value);
  }

  async function findMovie() {
    const response = await fetch(`${BASE_URL}${title}`);

    const result = await response.json();

    if (result.Response === 'False') {
      setErrorTitle(true);

      return;
    }

    const newMovie = [result].map(key => ({
      title: key.Title,
      imdbId: key.imdbID,
      description: key.Plot,
      imgUrl: key.Poster,
      imdbUrl: `https://www.imdb.com/title/${key.imdbID}`,

    }));

    setMovie(newMovie);
  }

  function addMovie() {
    if (movie && Object.keys(movie).length === 0) {
      setErrorMovie(true);

      return;
    }

    handleAdd(movie);
    setTitle('');
  }

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
              className="input is-danger"
            />
          </div>
          {errorTitle && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
          {errorMovie && (
          <p className="help is-danger">
            Can&apos;t add undefined movie
          </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={findMovie}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              onClick={addMovie}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.length > 0
          && <MovieCard {...movie[0]} />
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  handleAdd: PropTypes.func.isRequired,
};
