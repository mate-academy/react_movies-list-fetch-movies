import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  addMovie: (mov: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const onChangeHandler
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setIsError(false);
    };

  const onSubmit = (queryString: string) => {
    setLoading(true);

    getMovie(queryString.toLowerCase())
      .then((data: MovieData | ResponseError) => {
        if ('Title' in data) {
          const properPoster = data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster;

          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: properPoster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        } else {
          setIsError(true);
        }
      }).finally(() => setLoading(false));
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(query);
  };

  const onAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmitHandler}>
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
              className={
                classNames('input', {
                  'is-danger': isError,
                })
              }
              value={query}
              onChange={onChangeHandler}
            />
          </div>
          {
            isError
            && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                {
                  'is-loading': loading,
                })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {
            movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={onAddMovie}
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
      </form>

      {
        movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )
      }
    </>
  );
};
