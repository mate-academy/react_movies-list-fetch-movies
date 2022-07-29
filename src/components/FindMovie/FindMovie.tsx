import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  newMovies: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ newMovies }) => {
  const [name, setName] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlyAdd = (event: FormEvent) => {
    event.preventDefault();

    if (!name) {
      return;
    }

    getMovie(name).then(film => {
      if ('Error' in film) {
        setIsLoaded(false);
        setError(true);

        return;
      }

      setMovie({
        title: film.Title,
        imgUrl: film.Poster,
        imdbId: film.imdbID,
        imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
        description: film.Plot,
      });

      setError(false);
      setIsLoaded(false);
    });
  };

  const onAddMovie = () => {
    if (!movie) {
      return;
    }

    newMovies(movie);
    setMovie(null);
    setName('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handlyAdd(event)}
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
              value={name}
              onChange={(event) => {
                setName(event.target.value);
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
              className={classNames('button is-light', {
                'is-loading': isLoaded,
              })}
              disabled={!name}
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
                onClick={onAddMovie}
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
