import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { requestByTitle } from '../../api/requests';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');

  const [movie, setMovie] = useState({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
  });

  const [titleError, setTitleError] = useState({
    staus: false,
    message: '',
  });

  const titleChangeHandler = ({ value }) => {
    setTitle(value);
    setTitleError({
      staus: false,
      message: '',
    });
  };

  const findMovieHandler = () => {
    requestByTitle(title)
      .then(({ Title, Plot, Poster, imdbID, Response, Error }) => {
        if (Response === 'True') {
          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
          setTitle('');
        } else {
          setTitleError({
            status: true,
            message: Error,
          });
        }
      })
      .catch((err) => {
        setTitleError({
          status: true,
          message: err.message,
        });
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          addMovie(movie);
        }}
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
              className={classNames(
                'input',
                { 'is-danger': titleError.status },
              )}
              value={title}
              onChange={({ target }) => titleChangeHandler(target)}
            />
          </div>

          {titleError && (
            <p className="help is-danger">
              {titleError.message}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovieHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {Object.values(movie).some(value => value)
          ? <MovieCard {...movie} />
          : 'No movie to show'
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
