import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieShape } from '../shapes/MovieShape';
import { Preview } from '../Preview';
import { Buttons } from '../Buttons';
import { InputField } from '../InputField';

const KEY = '3e232a7e';
const API_URL = `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&t=`;

export const FindMovie = ({ addMovie, movies }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findMovie = async() => {
    setIsLoading(true);

    try {
      const response = await fetch(API_URL + value);
      const foundMovie = await response.json();

      if (foundMovie.Response === 'False') {
        throw new Error(`Can't find a movie with such a title`);
      }

      setMovie(formatMovie(foundMovie));
      setError('');
    } catch (Error) {
      setMovie(null);
      setError(Error.message);
    }

    setIsLoading(false);
  };

  const formatMovie = foundMovie => ({
    title: foundMovie.Title,
    description: foundMovie.Plot,
    imgUrl: foundMovie.Poster,
    imdbId: foundMovie.imdbID,
  });

  const handleChange = (event) => {
    setValue(event.target.value);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (movie === null) {
      setError('Please find movie first');

      return;
    }

    if (movies.find(oneMovie => oneMovie.imdbId === movie.imdbId)) {
      setError('Movie is already in the list');

      return;
    }

    addMovie(movie);
    setValue('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <InputField
          value={value}
          error={error}
          handleChange={handleChange}
        />

        <Buttons findMovie={findMovie} />
      </form>

      <Preview
        isLoading={isLoading}
        movie={movie}
      />
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape(MovieShape).isRequired,
  ).isRequired,
};
