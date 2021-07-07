import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api/movieFromServer';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, movies }) => {
  const [searchMovie, setSearchMovie] = useState('');
  const [previewMovie, setPreviewMovie] = useState({});
  const [errorFindMovie, setErrorFindMovie] = useState(false);
  const [visibleCard, setVisibleCard] = useState(false);

  const handleChange = (event) => {
    setSearchMovie(event.target.value);
    setErrorFindMovie(false);
  };

  const findedMovie = () => {
    getMovie(searchMovie)
      .then((movie) => {
        if (movie.Response === 'False') {
          setErrorFindMovie(true);
          setPreviewMovie({});

          return;
        }

        const newMovie = {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        };

        setPreviewMovie(newMovie);
        setVisibleCard(true);
      });
  };

  const addMovieList = () => {
    const emptyObject = previewMovie.imdbId;
    const duplicateCheck = movies.some(movie => (
      previewMovie.imdbId === movie.imdbId
    ));

    if (duplicateCheck || !emptyObject) {
      return;
    }

    addMovie(previewMovie);
    setVisibleCard(false);
    setSearchMovie('');
    setPreviewMovie({});
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
              value={searchMovie}
              onChange={handleChange}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorFindMovie,
              })}
            />
          </div>

          {errorFindMovie && (
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
              onClick={findedMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {visibleCard && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...previewMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbUrl: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
}.isRequired;
