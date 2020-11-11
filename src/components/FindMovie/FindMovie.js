import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { MovieShape } from '../shapes/MovieShape';
import { getFilm } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [serchTitle, setSerchTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [movieError, setMovieError] = useState('');
  const [loading, setLoading] = useState(false);

  const findFilm = async() => {
    setLoading(true);
    const requestedMovie = await getFilm(serchTitle);

    if (requestedMovie.Response === 'False') {
      setMovieError(`Can't find a movie with such a title`);
      setLoading(false);

      return;
    }

    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
    } = requestedMovie;

    const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

    setMovie({
      title,
      description,
      imgUrl,
      imdbUrl,
      imdbId,
    });

    setMovieError('');
    setLoading(false);
  };

  const handleChange = (event) => {
    setSerchTitle(event.target.value);
    setMovieError('');
  };

  const onAdd = () => {
    if (!movie) {
      setMovieError('Movie not selected');

      return;
    }

    const isMovieAlreadyExist = movies.find(movieFromList => (
      movieFromList.imdbId === movie.imdbId
    ));

    if (isMovieAlreadyExist) {
      setMovieError('Movie already exist');

      return;
    }

    addMovie(movie);
    setMovie(null);
    setSerchTitle('');
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
              className={
                classNames(
                  'input',
                  { 'is-danger': movieError },
                )
              }
              value={serchTitle}
              onChange={handleChange}
            />
          </div>
          {
            movieError
            && (
              <p className="help is-danger">
                {movieError}
              </p>
            )
          }

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
              onClick={onAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          loading
          && (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )
        }
        {
          (!loading && movie) && (<MovieCard {...movie} />)
        }

        <p>Film not selected</p>
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape(MovieShape),
  ).isRequired,
};
