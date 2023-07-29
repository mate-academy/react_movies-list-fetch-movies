import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
}) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleOnClick = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((movieFromServer) => {
        if (!Object.hasOwn(movieFromServer, 'Error')) {
          setNewMovie({
            title: movieFromServer.Title,
            description: movieFromServer.Plot,
            imgUrl: (movieFromServer.Poster === 'N/A')
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieFromServer.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
            imdbId: movieFromServer.imdbID,
          });
        } else {
          setNewMovie(null);
          setIsError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  const addMovie = useCallback((addedMovie: Movie) => {
    if (!movies.some(movie => movie.imdbId === addedMovie.imdbId)) {
      setMovies([
        ...movies,
        addedMovie,
      ]);
    }

    setNewMovie(null);
    setQuery('');
  }, [movies]);

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
              className={cn(
                'input',
                { 'is-danger': isError },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
            <p
              className={cn('help', 'is-danger')}
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="button"
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={query.length === 0}
              onClick={handleOnClick}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(newMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={newMovie} />
      </div>
    </>
  );
};
