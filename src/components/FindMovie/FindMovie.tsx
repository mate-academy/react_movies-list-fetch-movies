import './FindMovie.scss';

import React, { useState } from 'react';

import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface Props {
  handleMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ handleMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await getMovie(title);

      if ('Response' in res && res.Response === 'False') {
        setError(true);
        setMovie(null);
      } else {
        const movieData = res as MovieData;
        const imdbHTTPS = 'https://www.imdb.com/title/';
        const defaultPoster =
          'https://via.placeholder.com/360x270.png?text=no%20preview';
        const newMovie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster !== 'N/A' ? movieData.Poster : defaultPoster,
          imdbUrl: imdbHTTPS + movieData.imdbID,
          imdbId: movieData.imdbID,
        } as Movie;

        setMovie(newMovie);
        setError(false);
      }
    } catch (error) {
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = (newMovie: Movie) => {
    handleMovie(newMovie);
    setMovie(null);
    setTitle('');
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
              className={classNames('input', { 'is-danger': isError })}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>

          {isError && (
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
                'is-loading': isLoading,
              })}
              disabled={!title}
            >
              Find a movie
            </button>
          </div>

          {!isError && movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToList(movie)}
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
