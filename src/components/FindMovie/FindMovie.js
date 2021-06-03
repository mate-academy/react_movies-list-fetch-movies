import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, onAdd }) => {
  const moviePattern = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(moviePattern);
  const [isMovieCard, setIsMovieCard] = useState(false);
  const [error, setError] = useState('');

  const searchMovie = async() => {
    if (!title) {
      return;
    }

    const movieFromServer = await getMovie(title);

    if (movieFromServer !== null) {
      setIsMovieCard(true);
      setError('');

      // eslint-disable-next-line
      const { Title: movieTitle, Plot: description, Poster: imgUrl, imdbID: imdbId } = movieFromServer;

      setMovie({
        title: movieTitle,
        description,
        imgUrl,
        imdbUrl: `https://www.imdb.com/title/${imdbId}`,
        imdbId,
      });
    } else {
      setError(`Can&apos;t find a movie with such a title`);
    }
  };

  const setUpMovieTitle = (event) => {
    if (title) {
      clearState();
    }

    setTitle(event.target.value);
  };

  const addMovieToList = () => {
    clearState();
    if (isMovieInList()) {
      setError(`can&apos;t add, this movie is on the list`);

      return;
    }

    if (movie.title) {
      onAdd(movie);
    }
  };

  const isMovieInList = () => movies.some(curMovie => (
    curMovie.imdbId === movie.imdbId
  ));

  const clearState = () => {
    setTitle('');
    setMovie(moviePattern);
    setIsMovieCard(false);
    setError('');
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
              value={title}
              onChange={event => setUpMovieTitle(event)}
            />
          </div>

          <p className={classnames({
            help: true,
            's-danger': true,
            hide: error.length === 0,
          })}
          >
            {error}
          </p>

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={classnames({
                button: true,
                'is-primary': true,
                hide: !isMovieCard,
              })}
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className={classnames({
        container: true,
        hide: error.length > 0 || !isMovieCard,
      })}
      >
        <h2 className="title">Preview</h2>
        <MovieCard {...movie} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
};
