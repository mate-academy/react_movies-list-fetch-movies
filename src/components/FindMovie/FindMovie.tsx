/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<MovieData | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError(false);
  };

  const findMovie = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setError(true);
          setPreview(null);
        } else {
          setError(false);
          setPreview(data as MovieData);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const movie =
    preview && 'Title' in preview
      ? {
          title: preview.Title,
          description: preview.Plot,
          imgUrl:
            preview.Poster !== 'N/A'
              ? preview.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${preview.imdbID}`,
          imdbId: preview.imdbID,
        }
      : null;

  const addMovie = () => {
    if (movies.find(item => item.imdbId === movie?.imdbId)) {
      setTitle('');
      setPreview(null);

      return;
    }

    if (movie) {
      setTitle('');
      setPreview(null);
      setError(false);
      setMovies([...movies, movie]);
    }
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={handleTitleChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
          {<MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
