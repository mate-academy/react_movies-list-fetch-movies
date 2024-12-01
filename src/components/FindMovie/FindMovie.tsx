import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [querry, setQuerry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [film, setFilm] = useState<Movie | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!!error) {
      timer = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [error]);

  const handleRequest = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(querry.trim())
      .then(res => {
        setFilm(res as Movie);
      })
      .catch(e => setError(e.message))
      .finally(() => {
        setLoading(false);
        setQuerry('');
      });
  };

  const handleAddFilm = () => {
    onAddMovie(film as Movie);

    setFilm(null);
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
              value={querry}
              placeholder="Enter a title to search"
              className={`input ${false && 'is-danger'}`}
              onChange={event => setQuerry(event.target.value)}
            />
          </div>

          {!!error && (
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
              className={`button ${loading ? 'is-loading' : 'is-light'}`}
              {...((querry.length === 0 || loading) && { disabled: true })}
              onClick={event => handleRequest(event)}
            >
              Find a movie
            </button>
          </div>

          {film && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddFilm}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {film && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={film as Movie} />
        </div>
      )}
    </>
  );
};
