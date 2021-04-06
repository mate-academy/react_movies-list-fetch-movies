import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ handleAdd }) => {
  const [movieData, setMovieData] = useState({
    movie: {},
    title: '',
    errorTitle: false,
    errorMovie: false,
  });

  const handleChange = useCallback(
    (event) => {
      const { value } = event.target;

      setMovieData({
        movie: {},
        title: value,
        errorTitle: false,
        errorMovie: false,
      });
    },
    [],
  );

  const findMovie = useCallback(
    async() => {
      const result = await getMovie(movieData.title);

      if (result.Response === 'False') {
        setMovieData({
          ...movieData,
          errorTitle: true,
        });

        return;
      }

      const newMovie = [result].map(key => ({
        title: key.Title,
        imdbId: key.imdbID,
        description: key.Plot,
        imgUrl: key.Poster,
        imdbUrl: `https://www.imdb.com/title/${key.imdbID}`,
      }));

      setMovieData({
        ...movieData,
        movie: newMovie,
      });
    }, [movieData],
  );

  const addMovie = useCallback(
    () => {
      if (Object.keys(movieData.movie).length === 0) {
        setMovieData({
          ...movieData,
          errorMovie: true,
        });

        return;
      }

      handleAdd(movieData.movie);
      setMovieData({
        ...movieData,
        titel: '',
        errorMovie: false,
        errorTitle: false,
      });
    }, [movieData, handleAdd],
  );

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
              value={movieData.title}
              onChange={handleChange}
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>
          {movieData.errorTitle && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
          {movieData.errorMovie && (
          <p className="help is-danger">
            Can&apos;t add undefined movie
          </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={findMovie}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              onClick={addMovie}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieData.movie.length > 0
          && <MovieCard {...movieData.movie[0]} />
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  handleAdd: PropTypes.func.isRequired,
};
