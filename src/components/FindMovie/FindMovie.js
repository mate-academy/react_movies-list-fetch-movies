import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState();
  const [imdbId, setImdbId] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imdbUrl, setImdbUrl] = useState('');
  const [movieIsNotFound, setStatus] = useState(false);

  function findMovieByTitle(event) {
    event.preventDefault();
    getMovie(title)
      .then((result) => {
        if (result.Response === 'False') {
          setStatus(true);

          return;
        }

        setMovie(result.Title);
        setImdbId(result.imdbID);
        setDescription(result.Plot);
        setImgUrl(result.Poster);
        setImdbUrl(`https://www.imdb.com/title/${result.imdbID}`);
        setStatus(false);
      });
  }

  function addNewMovie() {
    const newMovie = {
      title: movie,
      description,
      imdbId,
      imgUrl,
      imdbUrl,
    };

    if (!movies.find(film => film.imdbId) && !movieIsNotFound && movie) {
      addMovie([...movies, newMovie]);
      setTitle('');
      setMovie('');
      setImdbId('');
      setDescription('');
      setImgUrl('');
      setImdbUrl('');
    }
  }

  function changeValue(event) {
    const { value } = event.target;

    setStatus(false);
    setTitle(value);
  }

  return (
    <>
      <form className="find-movie" onSubmit={findMovieByTitle}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={title}
              onChange={changeValue}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': movieIsNotFound })}
            />
          </div>

          {movieIsNotFound
        && (
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
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!movieIsNotFound && movie
      && (
      <MovieCard
        title={movie}
        description={description}
        imgUrl={imgUrl}
        imdbUrl={imdbUrl}
        imdbId={imdbId}
      />
      )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
