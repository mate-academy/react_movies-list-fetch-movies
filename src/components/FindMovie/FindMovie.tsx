import React, { useState } from 'react';
import classNames from 'classnames';
import { getFilm } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie>(null);
  const [error, seterror] = useState(false);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          if (!movies.find(el => el?.imdbID === movie?.imdbID)) {
            addMovie(current => [...current, movie]);
          }

          setMovie(null);
        }}
      >
        <div className="field">

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={movieTitle}
              onChange={(event) => {
                setMovieTitle(event.target.value);
                seterror(false);
              }}
            />
          </div>

          <p
            className={classNames('help is-danger', { hidden: error === false })}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              name="find-movie"
              id="find-movie"
              type="button"
              className="button is-light"
              onClick={(event) => {
                event.preventDefault();
                getFilm(movieTitle)
                  .then((response) => {
                    if (!response.Error) {
                      setMovie(response);
                      seterror(false);
                    } else {
                      seterror(true);
                      setMovie(null);
                    }
                  });

                setMovieTitle('');
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie !== null && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
