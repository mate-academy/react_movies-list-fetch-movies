import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

import './FindMovie.scss';

type Props = {
  addMovies: (v: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [data, setData] = useState<MovieData | ResponseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<boolean | null>(null);

  useEffect(() => {
    if (!title) {
      return;
    }

    setIsLoading(true);
    getMovie(title)
      .then(res => setData(res))
      .finally(() => setIsLoading(false));
  }, [title]);

  useEffect(() => {
    if (!data) {
      return;
    } else if ('Title' in data) {
      const dataPoster =
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview';

      setMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: dataPoster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      });
    } else {
      setIsError(true);
    }
  }, [data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      setTitle(query);
    }
  };

  const addToTheList = () => {
    if (movie) {
      addMovies(movie);
      setMovie(null);
      setTitle('');
      setQuery(null);
    }
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={!query ? '' : query}
              onChange={handleChangeInput}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': isError })}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {!!movie && (
              <button
                onClick={addToTheList}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {!!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
