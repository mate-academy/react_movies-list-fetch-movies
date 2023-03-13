import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { normalizeMovie } from '../../utils/normalizeMovie';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieExist, setMovieExist] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fetchMovie = await getMovie(query);

      if ((fetchMovie as MovieData).imdbID) {
        setMovie(normalizeMovie(fetchMovie as MovieData));
      } else {
        setErrorTitle(true);
      }
    } catch (error) {
      setErrorTitle(true);
    } finally {
      setLoading(false);
    }
  };

  const inputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorTitle(false);
    setMovie(null);
    setMovieExist(false);
  };

  const handleAddMovie = (newMovie:Movie) => {
    addMovie(prev => {
      if (prev.some(
        curr => curr.imdbId === newMovie.imdbId,
      )) {
        setMovieExist(true);

        return prev;
      }

      return [...prev, newMovie];
    });
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFind}>
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
              className={classNames('input', {
                'is-danger': errorTitle,
              })}
              value={query}
              onChange={inputChange}
            />
          </div>

          {errorTitle && (
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
              className={classNames('button is-light',
                { 'is-loading': loading })}
              disabled={!query}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {movieExist && (
            <p className="help is-danger">
              This movie is already on the list!
            </p>
          )}

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
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
