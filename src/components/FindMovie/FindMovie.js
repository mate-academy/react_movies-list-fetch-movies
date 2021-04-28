import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieType } from '../Types/MovieType';
import { AddMovieButton } from '../AddMovieButton';
import { FindMovieButton } from '../FindMovieButton';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [help, setHelp] = useState('');
  const [isInputFilledСorrectly, setIsInputFilledСorrectly] = useState(true);

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
              className={isInputFilledСorrectly
                ? 'input'
                : 'input is-danger'
              }
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </div>

          <p className="help is-danger">
            {help}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <FindMovieButton
              title={title}
              setMovie={setMovie}
              setHelp={setHelp}
              setIsInputFilledСorrectly={setIsInputFilledСorrectly}
            />
          </div>

          <div className="control">
            <AddMovieButton
              movie={movie}
              movies={movies}
              setMovies={setMovies}
              setTitle={setTitle}
              setMovie={setMovie}
              setHelp={setHelp}
            />
          </div>
        </div>
      </form>

      {movie && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard
          {...movie}
        />
      </div>
      )
      }
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape(MovieType)).isRequired,
  setMovies: PropTypes.func.isRequired,
};
