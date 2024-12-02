import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { transformToMovie } from '../../utils/transform';

type Props = {
  addMovieTotheList: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovieTotheList }) => {
  const [query, setQuery] = useState('');
  const [validQuery, setValidQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [moviePrev, setMoviePrev] = useState<MovieData | null>(null);
  const [err, setError] = useState<string | null>(null);

  const queryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

  useEffect(() => {
    const normalizedValue = query.trim().toLowerCase();
    setValidQuery(normalizedValue);
  }, [query]);

  const requestMovie = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      return;
    };

    setIsLoading(true);

    try {
      const response = await getMovie(validQuery);

      if ('Error' in response) {
        setMoviePrev(null);
        setError(response.Error);
      } else {
        setMoviePrev(response);
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (moviePrev) {
      const transformMovaieData = transformToMovie(moviePrev);

      addMovieTotheList(transformMovaieData);
      setQuery('');
      setMoviePrev(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={requestMovie}>
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
              className={classNames('input', {
                'is-danger': err
              })}
              value={query}
              onChange={queryChange}
            />
          </div>

          {err && (<p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>)}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {moviePrev && (<div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>)}
        </div>
      </form>

      {moviePrev && (<div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={transformToMovie(moviePrev)} />
      </div>)}
    </>
  );
};
