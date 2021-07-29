import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import propTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { BASE_API } from '../../api/api';

export const FindMovie = ({ onSubmit }) => {
  const [movieTitle, findMovieByTitle] = useState('');
  const [movie, addfoundMovie] = useState({});
  const [isMovieExsist, changeInputValidation] = useState(true);

  const isDanger = 'is-danger';

  const getMovieFromServer = () => fetch(`${BASE_API}&t=${movieTitle}`)
    .then(response => response.json())
    .then(result => result);

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
              // className="input is-danger"
              className={classNames('input', { [isDanger]: !isMovieExsist })}
              value={movieTitle}
              onChange={(event) => {
                findMovieByTitle(event.target.value);
                changeInputValidation(true);
              }}
            />
          </div>

          <p className="help is-danger">
            {!isMovieExsist && `Can't find a movie with such a title`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={async() => {
                const foundMovie = await getMovieFromServer();

                if (foundMovie.Response === 'True') {
                  addfoundMovie(foundMovie);
                } else {
                  changeInputValidation(false);
                }
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
                if (Object.keys(movie).length > 0) {
                  onSubmit({
                    title: movie.Title,
                    description: movie.Plot,
                    imgUrl: movie.Poster,
                    imdbId: movie.imdbID,
                  });
                  findMovieByTitle('');
                  addfoundMovie({});
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {Object.keys(movie).length > 0 && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            title={movie.Title}
            description={movie.Plot}
            imgUrl={movie.Poster}
            imdbId={movie.imdbID}
          />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  onSubmit: propTypes.func.isRequired,
};
