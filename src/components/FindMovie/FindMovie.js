import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [isFound, setIsFound] = useState(false);

  const addFilm = () => {
    addMovie(movie);
    setMovie(null);
  };

  const getMovie = async() => {
    setIsFound(false);
    const data = await request(title);

    if (data.Response === 'False') {
      setIsFound(true);
      setTitle('');
      setMovie(null);

      return;
    }

    setMovie({
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    });
    setTitle('');
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
              className={`input ${!isFound ? 'is-danger' : ''}`}
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </div>

          {isFound && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addFilm}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard {...movie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
