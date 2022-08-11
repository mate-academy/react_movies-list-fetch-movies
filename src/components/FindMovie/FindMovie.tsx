import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movieFound: Movie) => void | null
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [movieFound, setMovieFound]
    = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const loadMovie = () => {
    setLoading(true);
    getMovie(query).then(movie => {
      if ('Title' in movie) {
        const validMovie = {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster
           || 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
          imdbId: movie.imdbID,
        };

        setMovieFound(validMovie);
      } else {
        setError(true);
      }
    })
      .finally(() => {
        setLoading(false);
      });
  };

  const addMovieHandler = () => {
    if (movieFound) {
      addMovie(movieFound);
      setQuery('');
      setMovieFound(null);
      setError(false);
    }
  };

  const queryChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const preventFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!movieFound) {
      loadMovie();
    } else {
      addMovieHandler();
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={preventFormSubmit}>
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
              onChange={queryChangeHandler}
              value={query}
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
              type="button"
              className={classNames('button',
                'is-light', { 'is-loading': loading })}
              onClick={loadMovie}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className={classNames('button',
                'is-primary', { hidden: (!movieFound) })}
              onClick={addMovieHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <div>
          press &quot;Enter&quot; once to initiate search,
          if a movie has been found succesfully
          press &quot;Enter&quot; again to add it
        </div>
        <h2 className="title">Preview</h2>
        {
          (movieFound)
            ? <MovieCard movie={movieFound} />
            : null
        }
      </div>
    </>
  );
};
