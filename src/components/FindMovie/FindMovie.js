import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ movies, addMovieToList, switchNoInTheList }) => {
  const [cantFind, changeCantFind] = useState(false);
  const [movieFromInput, getMovieFromUser] = useState('');
  const [preview, updatePreview] = useState(movies[0]);

  const checkForMovie = () => {
    const input = movieFromInput.toLowerCase();
    const movieFromData = movies
      .find(film => film.title.toLowerCase() === input);

    if (movieFromData) {
      updatePreview(movieFromData);
    } else {
      getMovie(movieFromInput).then((movie) => {
        if (movie.Response === 'False') {
          changeCantFind(true);
        } else {
          const checkById = movies.find(film => film.imdbId === movie.imdbID);

          if (!checkById) {
            const newMovie = {
              title: movie.Title,
              imdbId: movie.imdbID,
              imgUrl: movie.Poster,
              imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
              description: movie.Plot,
            };

            updatePreview(newMovie);
            switchNoInTheList(true);
          } else {
            updatePreview(checkById);
          }
        }
      });
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
              value={movieFromInput}
              onChange={(event) => {
                getMovieFromUser(event.target.value);
                changeCantFind(false);
              }}
            />
          </div>
          {!cantFind || (
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
                checkForMovie();
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
                addMovieToList(preview);
                getMovieFromUser('');
              }}
              disabled={cantFind}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...preview} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  addMovieToList: PropTypes.func.isRequired,
  switchNoInTheList: PropTypes.func.isRequired,
};
