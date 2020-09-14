import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { findMoviesFromOMDb } from '../../api/findMovies';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, findMovieTitle] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [foundMovie, previewFoundMoive] = useState('');

  const handleSubmit = async() => {
    const movie = await findMoviesFromOMDb(movieTitle);

    if (movie.Response === 'False' || !movieTitle) {
      setNotFound(true);

      return;
    }

    previewFoundMoive({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      imdbId: movie.imdbID,
    });
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
              className={`input${notFound ? ' is-danger' : ''}`}
              value={movieTitle}
              onChange={(event) => {
                findMovieTitle(event.target.value);
                setNotFound(false);
              }}
            />
          </div>

          {notFound && (
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
              onClick={handleSubmit}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(foundMovie);
                findMovieTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie ? (
          <MovieCard {...foundMovie} />
        ) : ''}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
