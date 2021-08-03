import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movieCard, setMovie] = useState(null);
  const [found, setFound] = useState(false);

  const addFilm = () => {
    addMovie(movieCard);
    setMovie(null);
  };

  const getFilm = async() => {
    setFound(false);
    const data = await getMovie(value);

    if (data.Response === 'False') {
      setFound(true);
      setValue('');
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
    setValue('');
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
              className={`input ${!found ? '' : 'is-danger'}`}
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </div>
          {found && (
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
              onClick={() => getFilm()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addFilm()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieCard && (<MovieCard {...movieCard} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
