import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

export const FindMovie = (props) => {
  const [searchText, searchingText] = useState('');
  const [foundFilm, setFoundFilm] = useState(movies[0]);
  const [findingError, setError] = useState(false);

  const setSearchText = (e) => {
    searchingText(e.target.value);
    setError(false);
  };

  const searchFilm = async() => {
    const result = await (
      await fetch(`http://www.omdbapi.com/?apikey=b3f82314&t=${searchText}`)
    ).json();
    const film = {};

    if (result.Response === 'True') {
      film.title = result.Title;
      film.imgUrl = result.Poster;
      film.imdbId = result.imdbID;
      film.description = result.Plot;
      film.imdbUrl = `https://imdb.com/title/${result.imdbID}`;
      setFoundFilm(film);
    } else {
      setError(true);
    }
  };

  const addFilmToList = () => {
    const isCopy = !![...props.movies].find(
      movie => movie.imdbId === foundFilm.imdbId,
    );

    if (!isCopy) {
      props.addFilm(foundFilm);
    }
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
              className={findingError ? 'input is-danger' : 'input'}
              onChange={setSearchText}
            />
          </div>
          {findingError && (
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
              onClick={searchFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addFilmToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...foundFilm} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addFilm: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf().isRequired,
};
