import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import movies from '../../api/movies.json';
import { loadMovie } from '../../api/loader';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const handleChange = (event) => {
    setTitle(event.target.value);
    setLoaded(true);
  };

  const getMovie = async() => {
    setLoading(true);
    const movieFromServer = await loadMovie(title);

    if (movieFromServer.Response === 'False') {
      setLoaded(false);
    } else {
      const movieToAdd = {
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
        imdbId: movieFromServer.imdbID,
      };

      setLoaded(true);
      setMovie(movieToAdd);
    }

    setLoading(false);
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
              value={title}
              onChange={handleChange}
              placeholder="Enter a title to search"
              className={`input ${!loaded ? `is-danger`
                : ''}`}
            />
          </div>

          <p className="help is-danger">
            {!loaded ? `Can't find a movie with such a title`
              : ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={movie ? () => {
                addMovie(movie);
                setTitle('');
              } : ''}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {isLoading ? (
          <img
            src="https://i.gifer.com/2cOP.gif"
            alt="loading"
          />
        )
          : <MovieCard {...movie || { ...movies[0] }} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
