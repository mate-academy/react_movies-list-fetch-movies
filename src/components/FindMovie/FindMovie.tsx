import { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
  query: string,
  setQuery: (str: string) => void,
  movie: Movie | null,
  setMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
  query,
  setQuery,
  movie,
  setMovie,
}) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSearchBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsMovieLoading(true);
    if (query.trim().length) {
      getMovie(query)
        .then((loadedMovie) => {
          if ('Error' in loadedMovie) {
            return Promise.reject(loadedMovie.Error);
          }

          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = loadedMovie as MovieData;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });

          return Promise.resolve();
        })
        .catch(() => setHasError(true))
        .finally(() => setIsMovieLoading(false));
    }
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

          { hasError && (
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
                { 'is-loading': isMovieLoading },
              )}
              disabled={!query}
              onClick={handleSearchBtn}
            >
              {movie
                ? ('Search again')
                : ('Find a Movie')}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
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
