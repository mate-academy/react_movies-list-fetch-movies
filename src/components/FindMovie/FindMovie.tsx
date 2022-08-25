import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (film: Movie) => void;
  moviesList: Movie[];
};

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd, moviesList } = props;

  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [double, setDouble] = useState(false);

  const handleFindMovie = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setDouble(false);

      getMovie(query)
        .then(response => {
          if ('Error' in response) {
            setError(true);
            setMovie(null);
          } else {
            setMovie({
              title: response.Title,
              description: response.Plot,
              imgUrl: response.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : response.Poster,
              imdbUrl: `https://www.imdb/title/${response.imdbID}`,
              imdbId: response.imdbID,
            });
          }
        })
        .finally(() => setIsLoading(false));
    }, [query],
  );

  const handleOnAdd = () => {
    const index = moviesList
      .findIndex(film => film.title === movie?.title);

    if (index !== -1) {
      setDouble(true);

      return;
    }

    if (movie) {
      setDouble(false);
      onAdd(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
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
              onChange={(e) => {
                setQuery(e.target.value);
                setError(false);
              }}
            />
          </div>
          {error
            && (
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
              className={classNames('button',
                'is-light', { 'is-loading': isLoading })}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleOnAdd}
              disabled={movie === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {double
      && (
        <h2 className="double_movie">
          This movie is already in your list. Try another query
        </h2>
      )}

      {error
        ? <h2>Not films for your query</h2>
        : (
          <div className="container" data-cy="previewContainer">
            {movie !== null
            && (
              <>
                <h2 className="title">Preview</h2>
                <MovieCard movie={movie} />
              </>
            )}
          </div>
        )}
    </>
  );
};
