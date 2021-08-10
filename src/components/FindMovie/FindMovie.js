import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/api';

export const FindMovie = ({ addToList }) => {
  const [title, setTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const onSerchMovie = () => {
    getMovies(title)
      .then((found) => {
        if (found.Response === 'True') {
          setFoundMovie({
            title: found.Title,
            description: found.Plot,
            imgUrl: found.Poster,
            imdbUrl: `https://www.imdb.com/title/${found.imdbID}`,
            imdbId: found.imdbID,
          });
        } else {
          setTitle('');
          setFoundMovie(null);
        }
      });
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
              name="title"
              value={title}
              onChange={handleChange}
            />
          </div>

          {title
            ? ''
            : (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onSerchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addToList(foundMovie);
                setTitle(' ');
                setFoundMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundMovie
        && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...foundMovie} />
        </div>
        )
      }
    </>
  );
};

FindMovie.propTypes = {
  addToList: PropTypes.func.isRequired,
};
