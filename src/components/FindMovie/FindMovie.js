import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getFilms } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const findFilm = async() => {
    if (title === '') {
      return;
    }

    const film = await getFilms(title);

    if (film.Title === undefined) {
      setError(true);

      return;
    }

    setMovie({
      title: film.Title,
      description: film.Plot,
      imgUrl: film.Poster,
      imdbUrl: `https://www.imdb.com/title/${film.imdbID}/`,
      imdbId: film.imdbID,
    });
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
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
              placeholder="Enter a title to search"
              className={`input ${error && 'is-danger'}`}
              value={title}
              onChange={handleChange}
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
              type="submit"
              className="button is-light"
              onClick={findFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movie);
                setTitle('');
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && <h2 className="title">Preview</h2>}
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
