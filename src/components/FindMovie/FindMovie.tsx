import classNames from 'classnames';
import React, { useState } from 'react';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addNewMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const createMovie = (findMovie: MovieData) => {
    const {
      Poster,
      Title,
      Plot,
      imdbID,
    } = findMovie;

    setMovie({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imgUrl: !Poster
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleFindMovie = () => {
    setLoading(true);

    getMovie(query).then(findMovie => {
      if ('Error' in findMovie) {
        setHasError(true);
      } else {
        createMovie(findMovie);
        setHasError(false);
      }
    });

    setLoading(false);
  };

  const handleListAdd = () => {
    if (movie) {
      addNewMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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

          {hasError && (
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
                { 'is-loading': loading },
              )}
              disabled={!query}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleListAdd}
            >
              Add to the list
            </button>
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
