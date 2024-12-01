import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';

function normalizeMovieData(data: MovieData | null): Movie | null {
  if (data) {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  return null;
}

type Props = {
  onMovieAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<MovieData | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const normalizedMovie = normalizeMovieData(foundMovie);

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isError) {
      setIsError(false);
    }

    setQuery(event.target.value);
  };

  const handleFindNewMovieButtonClicked = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(response => {
        if ((response as ResponseError).Error) {
          setIsError(true);
        } else {
          setFoundMovie(response as MovieData);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovieToList = () => {
    onMovieAdd(normalizedMovie as Movie);

    setQuery('');
    setIsError(false);
    setFoundMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindNewMovieButtonClicked}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={onQueryChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
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
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                onClick={handleAddMovieToList}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {normalizedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={normalizedMovie} />
        </div>
      )}
    </>
  );
};
