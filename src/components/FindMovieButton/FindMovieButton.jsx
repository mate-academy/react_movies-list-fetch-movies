import React from 'react';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/helper';

export const FindMovieButton = ({
  title,
  setMovie,
  setHelp,
  setIsInputFilledСorrectly,
}) => {
  const findMovie = async() => {
    const movie = await getMovie(title);

    if (movie.Response === 'True') {
      setMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
      setHelp('');
      setIsInputFilledСorrectly(true);
    } else {
      setHelp('Can\'t find a movie with such a title');
      setMovie(null);
      setIsInputFilledСorrectly(false);
    }
  };

  return (
    <button
      type="button"
      className="button is-light"
      onClick={() => findMovie()}
    >
      Find a movie
    </button>
  );
};

FindMovieButton.propTypes = {
  title: PropTypes.string.isRequired,
  setMovie: PropTypes.func.isRequired,
  setHelp: PropTypes.func.isRequired,
  setIsInputFilledСorrectly: PropTypes.func.isRequired,
};
