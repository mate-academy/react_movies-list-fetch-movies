import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

const defaultURL = 'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props{
  handleAdd: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ handleAdd }) => {
  const [query, setQuery] = useState('');
  // const [queryForSearch, seQueryForSearch] = useState('');
  const [movie, setMovie] = useState<MovieData | undefined>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    // seQueryForSearch(query);
    setLoading(true);
    getMovie(query.trim())
      .then((data) => {
        if ('Error' in data) {
          setError(true);
        } else {
          setMovie(data);
        }
      })
      .finally(() => setLoading(false));
  };

  let currentMovie: Movie | undefined;

  if (movie) {
    currentMovie = {
      title: movie?.Title,
      description: movie.Plot,
      imgUrl: movie.Poster === 'N/A' ? defaultURL : movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      imdbId: movie.imdbID,
    };
  }

  const handleClickOnAdd = () => {
    if (currentMovie !== undefined) {
      handleAdd(currentMovie);
    }

    setQuery('');
    setMovie(undefined);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
                'is-danger': error,
              })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
                'button', 'is-light', { 'is-loading': loading },
              )}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {currentMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleClickOnAdd()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
