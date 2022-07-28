import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingError, setLoadingError] = useState(true);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const findMovie = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const movieFromServer = await getMovie(query);

    if ('Title' in movieFromServer) {
      const newMovie = {
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster !== 'N/A' ? movieFromServer.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
        imdbId: movieFromServer.imdbID,
      };

      setMovie(newMovie);
      setLoadingError(false);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const queryHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const addHandler = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
      setError(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findMovie}
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
              className="input is-dander"
              value={query}
              onChange={(e) => queryHandler(e)}
            />
          </div>
          <div>
            {isError && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )}
          </div>

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!movie
                ? ('Find a movie')
                : ('Find another movie')}
            </button>
          </div>
          {movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  disabled={isLoadingError}
                  onClick={addHandler}
                >
                  Add to the list
                </button>
              </div>
            )}

        </div>
      </form>
      {movie
      && (
        <>
          <div
            className="container"
            data-cy="previewContainer"
          >
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        </>
      )}
    </>
  );
};
