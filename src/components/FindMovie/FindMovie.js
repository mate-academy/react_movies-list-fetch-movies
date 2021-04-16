import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard, MovieCardType } from '../MovieCard';

export const FindMovie = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
  });
  const [hiddenError, setHiddenError] = useState('hidden');
  const [hiddenPreview, setPreview] = useState(true);
  const [hiddenErMovieRepeat, setHiddenErMovieRepeat] = useState('hidden');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  function getMovie() {
    return fetch(`https://www.omdbapi.com/?apikey=6e3cbe75&t=${title}`)
      .then(response => response.json());
  }

  const findMovie = async() => {
    const newMovie = await getMovie(title);
    const allImdbID = movies.map(movieData => movieData.imdbId);

    if (newMovie.Title) {
      setSubmitDisabled(false);
      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
        imdbId: newMovie.imdbID,
      });
    }

    if (allImdbID.includes(newMovie.imdbID)) {
      setHiddenErMovieRepeat('help is-danger');
      setSubmitDisabled(true);
    } else {
      setHiddenErMovieRepeat('hidden');
    }

    if (newMovie.Title === undefined) {
      setHiddenError('help is-danger');
      setPreview(true);
    } else {
      setHiddenError('hidden');
      setPreview(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMovie(movie);
    setTitle('');
    setPreview(true);
    setSubmitDisabled(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => handleSubmit(e)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={title}
              onChange={(e) => {
                setHiddenError('hidden');
                setTitle(e.target.value);
              }}
              placeholder="Enter a title to search"
              className="input"
            />
          </div>

          <p className={hiddenError}>
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={submitDisabled}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <p className={hiddenErMovieRepeat}>
          We have such movie!
        </p>
        <div hidden={hiddenPreview}>
          <MovieCard {...movie} />
        </div>
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({
    ...MovieCardType,
    imdbId: PropTypes.string.isRequired,
  })).isRequired,
};
