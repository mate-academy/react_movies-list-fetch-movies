import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [check, setCheck] = useState(false);
  const [searchMovie, setMovie] = useState({});

  const newMovie = {
    title: searchMovie.Title,
    description: searchMovie.Plot,
    imgUrl: searchMovie.Poster,
    imdbId: Math.random().toString(),
    imdbUrl: Math.random().toString(),
  };

  const request = () => {
    fetch(`https://www.omdbapi.com/?apikey=87d355ce&t=${title}`)
      .then(response => response.json())
      .then((movie) => {
        setMovie(movie);
        setError(movie.Response !== 'True');
        setCheck(movie.Response === 'True');
      });
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
              className={`input ${error && 'is-danger'}`}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
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
              onClick={() => {
                request();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                setCheck(false);
                setMovie({});
                setTitle('');
                if (check) {
                  addMovie(newMovie);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {searchMovie.Response === 'True' && (
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
