/* eslint-disable no-console */
import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
// import { MovieData } from '../../types/MovieData';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd } = props;

  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDone, setIsSubmitDone] = useState(false);

  const isQueryFilled = query !== '';

  const getImdbUrl = (id: string | null) => {
    if (id) {
      return `https://www.imdb.com/title/${id}`;
    }

    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then((res) => res.Title && setMovie({
        title: res.Title,
        description: res.Plot,
        imgUrl: res.Poster,
        imdbUrl: getImdbUrl(res.imdbID),
        imdbId: res.imdbID,
      }))
      .catch(() => {
        console.log(isSubmitDone);
      })
      .finally(() => {
        setIsLoading(false);
        setIsSubmitDone(true);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsSubmitDone(false);
              }}
            />
          </div>

          { isSubmitDone && !movie?.title && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                isLoading && 'is-loading',
              )}
              disabled={!isQueryFilled}
            >
              Find a movie
            </button>
          </div>

          {movie?.title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(movie);
                  setMovie(null);
                  setIsSubmitDone(false);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
