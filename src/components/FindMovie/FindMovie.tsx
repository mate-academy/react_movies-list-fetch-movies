import classNames from 'classnames';
import React, { useMemo, useState } from 'react';

import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

import './FindMovie.scss';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [change, setChange] = useState('');
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useMemo(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await getMovie(query);

        if (response) {
          const json = await response;

          if ('Response' in json
            && json.Response === 'False'
            && json.Error === 'Movie not found!') {
            setError(true);
          } else if ('Title' in json && 'imdbID' in json) {
            const movieData: Movie = json;

            setMovie(movieData);
            setError(false);
          } else {
            setError(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const handliChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setChange(inputValue);
    setError(false);
  };

  const handleSabmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setQuery(change);
  };

  const handleAddMovies = () => {
    if (movie) {
      setMovies((prevState: Movie[]) => {
        const movieExists = prevState.some((prevMovie: Movie | MovieData) => (
          'imdbID' in prevMovie && prevMovie.imdbID === movie.imdbID
        ));

        return movieExists ? prevState : [...prevState, movie];
      });
    }

    setMovie(null);
    setChange('');
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSabmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              onChange={handliChange}
              value={change}
            />
          </div>

          <p
            className={classNames('help', { 'is-danger': error })}
            data-cy="errorMessage"
          >
            {
              error && 'Can\'t find a movie with such a title'
            }
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames({
                'button is-light': !loading,
                'button is-light is-loading': loading,
              })}
              disabled={change.length === 0}
            >
              {!movie?.Title
                ? 'Find a movie'
                : 'Search a again'}
            </button>
          </div>

          {movie?.Title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovies}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie?.Title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
