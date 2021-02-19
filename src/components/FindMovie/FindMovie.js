import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { requestMovie } from '../../api/api';

export const FindMovie = ({ addMovie, isMovieAdded, setDuplicatedId }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [isMovieFind, setIsMovieFind] = useState(true);

  async function searchMovie() {
    const movieFromServer = await requestMovie(query
      .trim().split(' ').join('_'))
      .then(response => response.json());

    if (movieFromServer.Error) {
      setIsMovieFind(false);
    } else {
      setMovie({
        title: movieFromServer.Title,
        imdbId: movieFromServer.imdbID,
        imgUrl: movieFromServer.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}/`,
        description: movieFromServer.Plot,
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    searchMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isMovieFind ? 'input' : 'input is-danger'}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsMovieFind(true);
                setDuplicatedId(false);
              }}
            />
          </div>

          {!isMovieFind && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
          {isMovieAdded && movie && (
          <p className="help is-danger">
            This movie is already added
          </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setQuery('');
                }
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
        <MovieCard {...movie} />
      </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  setDuplicatedId: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired,
  isMovieAdded: PropTypes.bool.isRequired,
};
