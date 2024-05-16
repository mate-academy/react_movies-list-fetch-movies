import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
}

function createMovieInfo(movieData: MovieData | ResponseError): Movie | null {
  if ('Error' in movieData) {
    throw new Error(movieData.Error);
  }

  const { Title, Plot, Poster, imdbID } = movieData;

  return {
    title: Title,
    description: Plot,
    imgUrl:
      Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [movieError, setMovieError] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoadingMovie(true);

    getMovie(query)
      .then(createMovieInfo)
      .then(setMovie)
      .catch(() => setMovieError(true))
      .finally(() => setLoadingMovie(false));
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setMovieError(false);
  };

  const handleAddMovieClick = (newMovie: Movie) => {
    setMovie(null);
    setQuery('');
    setMovieError(false);

    onAdd(newMovie);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': movieError,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {movieError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': loadingMovie,
              })}
              disabled={query === ''}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovieClick(movie)}
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
