import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard, MovieCardType } from '../MovieCard';
import { InputFindMovie } from '../InputFindMovie';
import { getMovie } from '../../api';

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

    if (!newMovie.Title) {
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
      <InputFindMovie
        handleSubmit={handleSubmit}
        findMovie={findMovie}
        title={title}
        setTitle={setTitle}
        hiddenError={hiddenError}
        setHiddenError={setHiddenError}
        submitDisabled={submitDisabled}
      />
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
