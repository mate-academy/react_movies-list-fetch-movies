import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { findMovie } from '../Api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const nandleMovie = async() => {
    const movieFromServer = await findMovie(title);

    if (movieFromServer.Response === 'False') {
      setError(true);

      return;
    }

    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbId: movieFromServer.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
    });
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
    setError(false);
  };

  const addMovieToList = () => {
    addMovie(movie);
    setMovie(false);
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
              className="input is-danger"
              value={title}
              onChange={changeTitle}
            />
          </div>

          {error && (
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
              onClick={nandleMovie}
              disabled={!title.length}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
