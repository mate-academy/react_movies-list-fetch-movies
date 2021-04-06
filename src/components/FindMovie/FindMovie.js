import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { MovieForm } from '../MovieForm/MovieForm';

export const FindMovie = ({ addMovie, movies }) => {
  const [newMovie, setNewMovie] = useState(null);

  return (
    <>
      <MovieForm
        setNewMovie={setNewMovie}
        movies={movies}
        addMovie={addMovie}
        newMovie={newMovie}
      />
      <div className="container">
        <h2 className="title">Preview</h2>
        { newMovie && (<MovieCard {...newMovie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      imdbUrl: PropTypes.string,
      imdbId: PropTypes.string.isRequired,
    }),
  ),
};

FindMovie.defaultProps = {
  movies: [],
};
