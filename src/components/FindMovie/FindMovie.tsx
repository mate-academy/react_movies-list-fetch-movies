import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { loadMovie, url } from '../../api/api';

interface Props {
  addMovie: (film: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null as Movie | null);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  const { addMovie } = props;

  const handleFinder = async () => {
    setMovie(null);

    const data = await loadMovie(query);

    if (data.Response === 'False') {
      setError('Can\'t find a movie with such a title');
      setIsError(true);

      return;
    }

    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = data;

    const film = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `${url}&t=${Title}`,
      imdbId: imdbID,
    };

    setMovie(film);
  };

  const handleQuerier = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
    setIsError(false);
  };

  const handleAdder = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
    }
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
              className={classNames(
                'input',
                { 'is-danger': isError },
              )}
              value={query}
              onChange={handleQuerier}
            />
          </div>

          <p className="help is-danger">
            {error}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFinder}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAdder}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
