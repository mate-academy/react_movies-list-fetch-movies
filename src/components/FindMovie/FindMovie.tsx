import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { MovieData } from '../../types/MovieData';

type Props = {
  handleAddMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleAddMovies }) => {
  const [query, setQuery] = useState<string>('');

  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMesage] = useState<string | null>(null);

  function handleReset() {
    setQuery('');
    setFoundMovie(null);
  }

  function handleAddClick() {
    if (foundMovie) {
      handleAddMovies(foundMovie);

      handleReset();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setErrorMesage(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMesage(null);

    getMovie(query)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setErrorMesage(data.Error);
        } else {
          const movieData = data as MovieData;
          const oneFilm = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : movieData.Poster,
            imdbId: movieData.imdbID,
            imdbUrl: 'https://www.imdb.com/title/' + movieData.imdbID,
          };

          setFoundMovie(oneFilm);
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorMessage !== null,
              })}
              onChange={handleInputChange}
            />
          </div>

          {errorMessage !== null && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={query === ''}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading === true,
              })}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddClick()}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
