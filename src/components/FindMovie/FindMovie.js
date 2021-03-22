import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=de242cb8&t=';

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
  /*   const errorCatcher = useCallback(
    async() => {
      try {
        const response = await fetch(`${BASE_URL}${title}`);

        const result = await response.json();

        return result;
      } catch (error) {
        setErrorTitle(true);

        throw new Error();
      }
    },
    [],
  ); */
  /* IDK how to do with TRY CATCH (Q&A --->) */
  /*   const errorCatcher = async() => {
    try {
      const response = await fetch(`${BASE_URL}${movieData.title}`);

      const result = await response.json();

      return result;
    } catch {
      setMovieData({
        ...movieData,
        errorTitle: true,
      });
      // eslint-disable-next-line no-console
      throw new Error();
    }
  }; */

  const findMovie = useCallback(
    async() => {
      const response = await fetch(`${BASE_URL}${movieData.title}`);
      const result = await response.json();

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
      if (movieData.movie && Object.keys(movieData.movie).length === 0) {
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
