import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { getFilm } from '../req';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [newMovie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const findFilm = () => {
    getFilm(title)
      .then((card) => {
        card.Response === 'True'
          ? setMovie({
            title: card.Title,
            description: card.Plot,
            imgUrl: card.Poster,
            imdbUrl: `https://www.imdb.com/title/${card.imdbID}/`,
            imdbId: card.imdbID,
          })
          : setError(card);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addMovie(newMovie);

    setTitle('');
    setMovie(null);
    setError(false);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
            onSubmit={e => handleSubmit(e)}

          >
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={title}
              onChange={e => handleChange(e)}
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
              type="button"
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
              onClick={handleSubmit}
              disabled={!newMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {newMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
