import React, { useCallback, useMemo, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

interface FindMovieProps {
  query: string;
  setQuery: (arg: string) => void;
  movies: Movie[];
  setMovies: (arg: Movie[]) => void;
}

function newListOfMovies(movies: Movie[], newMovie: Movie | null) {
  if (newMovie) {
    const mov = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (mov === undefined) {
      return [...movies, newMovie];
    } else {
      return movies;
    }
  }

  return movies;
}

export const FindMovie: React.FC<FindMovieProps> = ({
  query,
  setQuery,
  movies,
  setMovies,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    getMovie(query)
      .then(Response => {
        setLoading(true);

        if ('Error' in Response) {
          setIsError(true);
        } else {
          setMovie({
            title: Response.Title,
            description: Response.Plot,
            imgUrl:
              Response.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : Response.Poster,
            imdbId: Response.imdbID,
            imdbUrl: `https://www.imdb.com/title/${Response.imdbID}`,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {};
  }, [query]);

  const newList = useMemo(() => {
    return newListOfMovies(movies, movie);
  }, [movies, movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();

          return handleSubmit();
        }}
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
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={query}
              onChange={event => {
                event.preventDefault();
                setQuery(event.target.value.trimStart());
                setIsError(false);
              }}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={query ? false : true}
            >
              {!loading && movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={event => {
                  event.preventDefault();
                  setQuery('');
                  setMovies(newList as Movie[]);
                  setMovie(null);
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
