import React, { useState } from 'react';
import './FindMovie.scss';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import { fetchMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [canAddMovie, setCanAddMovie] = useState(false);

  const searchMovie = async(title) => {
    const movie = await fetchMovie(title);

    if (movie.Response === 'False') {
      setNotFound(true);
      setShowPreview(false);
      setCanAddMovie(false);
    } else {
      setFoundMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
        imdbId: movie.imdbID,
      });
      setNotFound(false);
      setShowPreview(true);
      setCanAddMovie(true);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          searchMovie(searchTitle);
        }
        }
        autoComplete="off"
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
              className={ClassNames({
                input: true,
                'is-danger': notFound,
              })}
              value={searchTitle}
              onChange={(event) => {
                setSearchTitle(event.target.value);
                setNotFound(false);
              }}
            />
          </div>
          {notFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
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
              disabled={!canAddMovie}
              onClick={() => {
                addMovie(foundMovie);
                setShowPreview(false);
                setCanAddMovie(false);
                setSearchTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {showPreview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...foundMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
