import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { movieShape } from '../../shapes/movieShape';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, movies }) => {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState(null);

  const checkMovie = () => {
    const isMovieAdded = movies.find(film => film.imdbID === movie.imdbID);

    if (isMovieAdded) {
      return;
    }

    addMovie([...movies, movie]);
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
              value={inputValue}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(event) => {
                setError('');
                setInputValue(event.target.value);
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
                if (!inputValue) {
                  return;
                }

                // eslint-disable-next-line max-len
                fetch(`https://www.omdbapi.com/?apikey=bcb65536&t=${inputValue}`)
                  .then(result => result.json())
                  .then(setMovie)
                  .catch(() => {
                    setError(1);
                  });
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
                if (!inputValue) {
                  return;
                }

                checkMovie();
                setInputValue('');
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            title={movie.Title}
            description={movie.Plot}
            imgUrl={movie.Poster}
            imdbUrl={`https://www.imdb.com/title/${movie.imdbID}`}
          />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(movieShape).isRequired,
};
