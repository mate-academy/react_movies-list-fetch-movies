import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLading] = useState(false);
  const [error, setError] = useState(false);

  const handleFindMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMovie(null);
    setIsLading(true);
    setError(false);

    getMovie(query)
      .then((res) => {
        if ('Error' in res) {
          setIsLading(false);
          setError(true);

          return;
        }

        if ('Title' in res) {
          const {
            Title, Plot, Poster, imdbID,
          } = res;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl:
              Poster !== 'N/A'
                ? Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
            imdbId: imdbID,
          });
        }
      })
      .finally(() => setIsLading(false));
  };

  const handleAddMovieToList = () => {
    if (movie) {
      setMovies((prev) => {
        const hasMovie = prev.some(
          (prevMovie) => prevMovie.imdbId === movie.imdbId,
        );

        if (hasMovie) {
          return prev;
        }

        return [...prev, movie];
      });
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
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
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <p
            className="help is-danger"
            data-cy="errorMessage"
          >
            {error && 'Can`t find a movie with such a title'}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieToList}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div
        className="container"
        data-cy="previewContainer"
      >
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
