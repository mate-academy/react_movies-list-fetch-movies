import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import './Popup.scss';

export const Popup = ({
  error,
  moviesFromServer,
  moviesIds,
  callBack,
  closePopup,
}) => {
  const [moviesObject, setMovies] = useState({});

  const handleUserChoise = (choisenMovie) => {
    if (!moviesObject[choisenMovie.imdbId]) {
      setMovies(movies => ({
        ...movies, [choisenMovie.imdbId]: choisenMovie,
      }));
    } else {
      delete moviesObject[choisenMovie.imdbId];
      setMovies({ ...moviesObject });
    }
  };

  return (
    <>
      <div className="popup__content">
        <button
          className="btn-add"
          type="button"
          onClick={() => callBack(Object.values(moviesObject))}
          disabled={!Object.keys(moviesObject).length}
        >
          ADD
        </button>

        <button
          className="btn-close"
          type="button"
          onClick={() => closePopup([])}
        >
          X
        </button>

        {
          !error && moviesFromServer.map(movie => (
            <li
              className="wrapper"
              key={movie.imdbId}
            >
              <span
                role="button"
                styling="link"
                tabIndex={0}
                className={classNames(
                  'card',
                  {
                    'is-in-list': moviesIds.includes(movie.imdbId),
                    'is-choisen': !!moviesObject[movie.imdbId],
                  },
                )}
                onClick={() => {
                  if (!moviesIds.includes(movie.imdbId)) {
                    handleUserChoise(movie);
                  }
                }}
                aria-hidden
              >
                <MovieCard
                  {...movie}
                />
              </span>
            </li>
          ))
        }
      </div>
    </>
  );
};

Popup.propTypes = {
  error: PropTypes.string.isRequired,
  moviesFromServer: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
  moviesIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  callBack: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
};
