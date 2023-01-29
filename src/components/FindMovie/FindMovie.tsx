import classNames from 'classnames';
import React, { useState } from 'react';

import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseIsError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  setMovies,
  movies,
}) => {
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const movieLoading = (response: MovieData) => {
    const {
      Poster: imgUrl,
      Title: title,
      Plot: description,
      imdbID: imdbId,
    } = response;

    const movieRequested: Movie = {
      imgUrl,
      title,
      description,
      imdbId,
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
    };

    if (imgUrl === 'N/A') {
      movieRequested.imgUrl
      = 'https://via.placeholder.com/360x270.png?text=no%20preview';
    }

    setPreview(movieRequested);
  };

  const handleSubmitClick = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then((res: MovieData | ResponseIsError) => {
        if ('Title' in res) {
          movieLoading(res);
        } else {
          setIsError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onAdd = () => {
    if (preview
      && !movies.some(film => film.imdbId === preview.imdbId)) {
      setMovies((prevMovies) => ([
        ...prevMovies,
        preview,
      ]));
    }

    setPreview(null);
    setQuery('');
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmitClick}
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
              onChange={handleChangeQuery}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="IsErrorMessage">
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
                { 'is-light': !isLoading },
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={preview}
            key={preview.imdbId}
          />
        </div>
      )}
    </>
  );
};
