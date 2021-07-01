import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import './Popup.scss';

export const Popup = ({ error,
  moviesFromServer,
  moviesIds,
  callBack,
  closePopup }) => {
  const [choisenMoviesList, handleChange] = useState([]);

  const handleUserChoise = (choisenMovie) => {
    if (!choisenMoviesList.includes(choisenMovie)) {
      handleChange(movies => [...movies, choisenMovie]);
    } else {
      handleChange(movies => movies.filter(movie => movie !== choisenMovie));
    }
  };

  return (
    <>

      <div className="popup__content">
        {/* <div className="popup__controlers-block"> */}

        <button
          className="btn-add"
          type="button"
          onClick={() => {
            callBack(choisenMoviesList);
          }}
          disabled={!choisenMoviesList.length}
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

        {/* </div> */}

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
                style={{
                  cursor: !moviesIds.includes(movie.imdbId) && 'pointer',
                }}
                className={classNames(
                  'card',
                  {
                    'is-in-list': moviesIds.includes(movie.imdbId),
                    'is-choisen': choisenMoviesList.includes(movie),
                  },
                )}
                onClick={() => {
                  if (!moviesIds.includes(movie.imdbId)) {
                    handleUserChoise(movie);
                  }
                }}

                onKeyDown={() => { }}
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
