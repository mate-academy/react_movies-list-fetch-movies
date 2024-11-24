import React, { useEffect, useState } from 'react';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import './FindMovie.scss';
import classNames from 'classnames';

type Props = {
  setMovie: (a: Movie | null) => void;
  setMovies: (a: Movie[]) => void;
  movie: Movie | null;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  setMovie,
  movie,
  movies,
  setMovies,
}) => {
  const [querry, setQuerry] = useState('');
  const [findMovieButton, setFindMovieButton] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (findMovieButton) {
      setLoading(true);
      getMovie(querry)
        .then(res => {
          if (res.Response === 'False') {
            setMovie(null);
            setSearchError(true);
          } else {
            setMovie(res);
          }
        })
        .catch(error => {
          console.error('Network or parsing error:', error);
        })
        .finally(() => setLoading(false));
    }

    return () => setFindMovieButton(false);
  }, [findMovieButton]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchError(false);
    setQuerry(event.target.value);
  }

  function handleAddButton(event: React.ChangeEvent<HTMLButtonElement>) {
    event.preventDefault();

    const isAlreadyPresent = movies.find(
      currentMovie => currentMovie.imdbID === movie?.imdbID,
    );

    if (!isAlreadyPresent) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setQuerry('');
  }

  function handleFindMovieButton(event: React.ChangeEvent<HTMLButtonElement>) {
    event.preventDefault();
    setFindMovieButton(true);
  }

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
              className="input"
              value={querry}
              onChange={handleInputChange}
            />
          </div>

          {searchError && (
            <p className="help is-danger" data-cy="errorMessage">
              {"Can't find a movie with such a title"}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!querry}
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              onClick={handleFindMovieButton}
            >
              {!movie ? 'Find a movie' : 'Search Again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
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
