import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  findMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ findMovie }) => {
  const [query, setSearch] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!query) {
      return;
    }

    setLoaded(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(true);
          setLoaded(false);

          return;
        }

        setMovie({
          title: data.Title,
          imgUrl: data.Poster,
          imdbId: data.imdbID,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          description: data.Plot,
        });

        setError(false);
        setLoaded(false);
      });
  };

  const onAdd = () => {
    if (!movie) {
      return;
    }

    findMovie(movie);
    setSearch('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => onSubmit(event)}
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
              onChange={(event) => setSearch(event.target.value)}
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
              disabled={!query}
              className={classNames('button is-light', {
                'is-loading': isLoaded,
              })}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!query}
                onClick={onAdd}
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
