import React, { useState } from 'react';
import './FindMovie.scss';

import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie:(movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setNewMovie] = useState<Movie>();
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSetMovie(response: MovieData | ResponseError) {
    if ('Error' in response) {
      setError(true);

      return;
    }

    const {
      Title, Poster, Plot, imdbID,
    } = response;

    const DEFAULT_IMG
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

    const poster = Poster === 'N/A'
      ? DEFAULT_IMG
      : Poster;

    setNewMovie({
      title: Title,
      description: Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    });
  }

  function handleFindMovie(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setLoading(true);
    e.preventDefault();
    setError(false);
    getMovie(searchValue)
      .then(response => handleSetMovie(response))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    if (movie) {
      setSearchValue('');
      onAddMovie(movie);
      setNewMovie(undefined);
    }
  }

  function handleChange(value: string) {
    setError(false);
    setSearchValue(value);
  }

  return (
    <>
      <form className="find-movie">
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
              className={cn('input', { 'is-danger': error })}
              value={searchValue}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', { 'is-loading': loading })}
              disabled={!searchValue}
              onClick={(e) => handleFindMovie(e)}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
