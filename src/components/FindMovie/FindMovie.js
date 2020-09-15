import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getFilms } from '../../api/api';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

export const FindMovie = ({ addMovie }) => {
  const [movie, changeMovie] = useState(movies[0]);
  const [title, changeTitle] = useState('');
  const [error, changeError] = useState(false);

  const findFilm = async() => {
    if (title === '') {
      return;
    }

    const film = await getFilms(title);

    if (film.Title === undefined) {
      changeError(true);

      return;
    }

    changeMovie({
      title: film.Title,
      description: film.Plot,
      imgUrl: film.Poster,
      imdbUrl: `https://www.imdb.com/title/${film.imdbID}/`,
      imdbId: film.imdbID,
    });
  };

  const handleChange = (event) => {
    changeTitle(event.target.value);
    changeError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          changeTitle('');
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
              onClick={() => addMovie(movie)}
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
  addMovie: PropTypes.func.isRequired,
};
