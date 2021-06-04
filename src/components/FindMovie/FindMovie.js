import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getResponse } from '../../api/findMovie';

export const FindMovie = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');

  const [movie, setMovie] = useState(null);

  const [movieFound, setMovieFind] = useState(true);

  useEffect(() => {
    setMovieFind((true));
  }, [movie]);

  const onFindMovie = () => {
    getResponse(title).then((result) => {
      if (!result.Error) {
        setMovie({
          title: result.Title,
          imgUrl: result.Poster,
          description: result.Plot,
          imdbId: result.imdbID,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        });
      } else {
        setMovieFind(false);
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
              className={classNames({
                input: true,
                'is-danger': !movieFound,
              })}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>
          {movieFound || (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                 // eslint-disable-line 
                movie && onAddMovie(movie);  // eslint-disable-line 
                setTitle('');
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        { movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
