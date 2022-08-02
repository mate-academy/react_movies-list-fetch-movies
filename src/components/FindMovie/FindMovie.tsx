import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingError, setIsLoadingError] = useState(true);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const findMovie = async () => {
    const res = await getMovie(query);

    if ('Error' in res) {
      setError(true);
      setLoading(false);

      return;
    }

    const newMovie = {
      title: res.Title,
      description: res.Plot,
      imgUrl: res.Poster
        || 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
      imdbId: res.imdbID,
    };

    setMovie(newMovie);
    setIsLoadingError(false);
    setLoading(false);
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
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              {'Can\'t find a movie with such a title'}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="button"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
              onClick={() => {
                setLoading(true);
                findMovie();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={isLoadingError}
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setIsLoadingError(true);
                  setQuery('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {!isLoadingError && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
