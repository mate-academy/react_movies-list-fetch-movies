import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovies }) => {
  const [value, setValue] = useState('');
  const [card, setCard] = useState({});
  const [printWarning, setPrintWarning] = useState(true);
  const [addCard, setAddCard] = useState(false);
  const imgUrl = card.Poster;
  const imdbId = card.imdbID;
  const title = card.Title;
  const description = card.Plot;
  const imdbUrl = `https://www.imdb.com/title/${card.imdbID}`;

  return (
    <>
      <form
        onSubmit={event => event.preventDefault()}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={value}
              onChange={({ target }) => {
                setValue(target.value);
                setPrintWarning(true);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', !printWarning && 'is-danger')}
            />
          </div>

          {!printWarning && (
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
              onClick={() => {
                if (value.length) {
                  setPrintWarning(true);
                  setAddCard(true);
                  fetch(`https://www.omdbapi.com/?apikey=2141309e&t=${value}`)
                    .then(a => a.json()).then(b => setCard(b));
                } else {
                  setPrintWarning(false);
                }
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={!addCard}
              type="button"
              className="button is-primary"
              onClick={() => {
                setCard({});
                setAddCard(false);
                setValue('');
                if (addCard) {
                  addMovies(
                    {
                      imgUrl, title, description, imdbUrl,
                    },
                  );
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <>
        {(Object.keys(card).length !== 0) && (
          <div className="container">
            <MovieCard
              imgUrl={imgUrl}
              title={title}
              description={description}
              imdbUrl={imdbUrl}
              imdbId={imdbId}
            />
          </div>
        )}
      </>
    </>
  );
};

FindMovie.propTypes = {
  addMovies: PropTypes.func.isRequired,
};
