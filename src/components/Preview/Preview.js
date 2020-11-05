import React from 'react';
import PropTypes from 'prop-types';
import { MovieShape } from '../shapes/MovieShape';
import { MovieCard } from '../MovieCard';
import './Prewiew.scss';

export const Preview = ({ movie, isLoading }) => (
  <div className="container">
    <h2 className="title">Preview</h2>
    {
      isLoading && (
        <div className="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      )
    }

    {
      (movie && !isLoading) && (
        <MovieCard {...movie} />
      )
    }
  </div>
);

Preview.propTypes = {
  movie: PropTypes.shape(MovieShape),
  isLoading: PropTypes.bool.isRequired,
};

Preview.defaultProps = {
  movie: null,
};
