import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
// import { MovieData } from '../../types/MovieData';
// import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (m: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadind, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChangeQuery = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(ev.target.value);
    setIsError(false);
  };

  const handleFindMovie = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((response) => {
        if ('Error' in response) {
          throw new Error();
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  const handleMovieAdd = (newMovie: Movie) => {
    addMovie(newMovie);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie">
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
              className={classNames('input', { 'is-danger': isError })}
              onChange={handleChangeQuery}
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
              className={classNames('button is-light',
                { 'is-loading': isLoadind })}
              disabled={query === ''}
              onClick={ev => handleFindMovie(ev)}
            >
              {!movie ? 'Find a movie' : 'Search again'}

            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleMovieAdd(movie)}
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
