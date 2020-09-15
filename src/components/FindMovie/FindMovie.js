import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, setMovies }) => {
  const [movieName, setMovieName] = useState('');
  const [previewMovie, setPreviewMovie] = useState(null);
  const [error, setError] = useState(null);

  const onChangeFilter = (event) => {
    if (error !== null) {
      setError(null);
    }

    setMovieName(event.target.value);
  };

  // eslint-disable-next-line consistent-return
  const findMovie = async() => {
    try {
      const response = await
      fetch(`https://www.omdbapi.com/?apikey=b65353eb&t=${movieName}`);
      const data = await response.json();

      if (data.Response === 'False') {
        return setError(data.Error);
      }

      setPreviewMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbid: data.imdbID,
      });
    } catch (err) {
      setError('404 no connection to the server');
    }
  };

  const addMovie = () => {
    let movieIncludes = false;

    if (previewMovie) {
      Object.values(movies).forEach((movie) => {
        if (movie.imdbid === previewMovie.imdbid) {
          movieIncludes = true;
        }
      });
      if (movieIncludes === false) {
        setMovies([...movies, previewMovie]);
        setMovieName('');
      }
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
              value={movieName}
              onChange={onChangeFilter}
            />
          </div>
          {error
            && (
              <p className="help is-danger">
                {
                  error
                }
              </p>
            )
          }

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {previewMovie && <MovieCard {...previewMovie} />}

      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.shape({
    imdbid: PropTypes.number.isRequired,

  }).isRequired,
  setMovies: PropTypes.func.isRequired,
};
