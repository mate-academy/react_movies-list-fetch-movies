import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import './FindMovie.scss';

type Props = {
  addFindedMovie: (findedMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addFindedMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const onSubmitFindMovie = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    // eslint-disable-next-line max-len
    const defaultPic = 'https://via.placeholder.com/360x270.png?text=no%20preview';

    getMovie(query)
      .then(movieData => {
        if ('Error' in movieData) {
          setHasError(true);

          return;
        }

        const normalizeMovieData = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster ? movieData.Poster : defaultPic,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
          imdbId: movieData.imdbID,
        };

        setFindedMovie(normalizeMovieData);
      })
      .finally(() => {
        setLoading(false);
      });

    if (!findedMovie) {
      return;
    }

    addFindedMovie(findedMovie);
    setHasError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmitFindMovie}>
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
                setHasError(false);
              }}
            />
          </div>

          {hasError && (
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
                'button is-light',
                {
                  'is-loading': loading,
                },
              )}
              disabled={!query}
            >
              {findedMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addFindedMovie(findedMovie);
                  setQuery('');
                  setFindedMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {findedMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={findedMovie} />
          </>
        )}
      </div>
    </>
  );
};
