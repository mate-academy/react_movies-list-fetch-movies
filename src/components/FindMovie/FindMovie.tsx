import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const defImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoaded(true);

    try {
      await getMovie(query)
        .then(newMovie => {
          if ('Error' in newMovie) {
            throw Error(newMovie.Error);
          } else {
            setMovie({
              title: newMovie.Title,
              description: newMovie.Plot,
              imgUrl: newMovie.Poster !== 'N/A' ? newMovie.Poster : defImg,
              imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
              imdbId: newMovie.imdbID,
            });
          }
        });
    } catch (Error) {
      setError(true);
    } finally {
      setIsLoaded(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
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
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': isLoaded,
                },
              )}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
                  setQuery('');
                  setMovie(null);
                }}
                disabled={!query}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {
        movie && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )
      }
    </>
  );
};
