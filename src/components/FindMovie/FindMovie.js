import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=6fdb8fe3';

const getMovie = async(url) => {
  const response = await fetch(`${BASE_URL}&t=${url}`);

  if (!response.ok) {
    throw new Error(`Failed to load remote data from ${url}`);
  }

  const result = await response.json();

  return result;
};

export const FindMovie = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    setWarning('');
  }, [title]);

  const handleSearchMovie = useCallback(async() => {
    if (title.length === 0) {
      setWarning('Please enter a title!');
      setMovie(null);

      return;
    }

    const movieData = await getMovie(title);

    if (movieData.Response === 'False') {
      setWarning(movieData.Error);
      setMovie(null);

      return;
    }

    setMovie({
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster,
      imdbUrl: `https://imdb.com/title/${movieData.imdbID}/`,
      imdbId: movieData.imdbID,
    });
  }, [title]);

  const handleAddMovie = useCallback(() => {
    if (!movie) {
      setWarning('Please find a movie first.');

      return;
    }

    onAddMovie(movie);
    setMovie(null);
    setTitle('');
  }, [movie]);

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
              className={`input${warning && ' is-danger'}`}
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </div>

          <p className="help is-danger">
            {warning}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleSearchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {
        movie
          && (
            <div className="container">
              <h2 className="title">Preview</h2>
              <MovieCard key={movie.imdbId} {...movie} />
            </div>
          )
      }
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
