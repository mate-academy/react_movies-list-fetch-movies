import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [erorr, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMovie = () => {
    setLoading(true);

    getMovie(query)
      .then(result => {
        if ('Title' in result) {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = result;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          });
        }

        setError(true);
      })
      .finally(() => setLoading(false));
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
              className={classNames(
                'input',
                {
                  'is-dander': erorr,
                },
              )}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setError(false);
              }}
            />
          </div>

          {erorr && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              className={classNames(
                'button is-light',
                {
                  'is-loading': loading,
                },
              )}
              data-cy="searchButton"
              type="submit"
              disabled={!query}
              onClick={(e) => {
                e.preventDefault();
                loadMovie();
              }}
            >
              {!movie ? ('Find a movie') : ('Search again')}
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
                  setQuery('');
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
