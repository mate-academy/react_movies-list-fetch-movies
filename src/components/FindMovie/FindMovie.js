import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovieToList }) => {
  const [title, setTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState();
  const [printWarning, setPrintWarning] = useState(true);

  async function getData() {
    const movie = await getMovie(title);

    createMovie(movie);
  }

  const createMovie = ({ Title, Plot, Poster, imdbID }) => {
    if (Title === undefined) {
      setFoundMovie(null);
      setPrintWarning(false);

      return;
    }

    const newMovie = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    setFoundMovie(newMovie);
  };

  const clearFrom = () => {
    addMovieToList(foundMovie);
    setFoundMovie('');
    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={((event) => {
                setTitle(event.target.value);
                setPrintWarning(true);
              })}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {
            !printWarning && (
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
              onClick={getData}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={
                () => foundMovie && clearFrom()
              }
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie && <MovieCard {...foundMovie} /> }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovieToList: PropTypes.func.isRequired,
};
