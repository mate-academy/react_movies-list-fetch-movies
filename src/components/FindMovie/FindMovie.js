import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';

export const FindMovie = ({ onAdd }) => {
  const [movie, setMovie] = useState({});
  const [title, setTitle] = useState('');
  const [isFilmNotFound, setIsFilmNotFound] = useState(false);
  const [couldPreview, setcouldPreview] = useState(false);
  const [couldAdd, setCouldAdd] = useState(false);

  const handleChange = (e) => {
    setTitle(e.target.value.toLowerCase());
  };

  const handleSearch = () => {
    getFilm(title).then((findFilm) => {
      setMovie(findFilm);
      setIsFilmNotFound(false);
      setcouldPreview(true);
    })
      .catch((e) => {
        setIsFilmNotFound(true);
        setcouldPreview(false);
      });
  };

  const handleAdd = () => {
    if (couldPreview) {
      onAdd(movie);
      setMovie({});
      setIsFilmNotFound(false);
      setcouldPreview(false);
      setTitle('');
    } else {
      setCouldAdd(false);
    }
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
              className="input is-danger"
              value={title}
              onChange={handleChange}
            />
          </div>

          {isFilmNotFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {couldAdd && (
            <p className="help is-danger">
              Can&apos;t add a movie
            </p>
          )}
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
              onClick={handleAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {couldPreview && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
