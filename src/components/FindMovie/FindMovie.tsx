/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<MovieData | null>(null);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(res => {
        if ('Error' in res) {
          setError(true);
          setPreview(null);
        }

        setPreview(res as MovieData);
      })
      .finally(() => {
        setLoading(false);
      });
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
          imdbUrl: 'https://www.imdb.com/title/' + preview.imdbID,
          imdbId: preview.imdbID,
        }
      : null;

  const handleAdd = () => {
    if (movie) {
      if (movies.every(item => item.imdbId !== movie.imdbId)) {
        setMovies([...movies, movie]);
        setQuery('');
        setPreview(null);
      } else {
        setQuery('');
        setPreview(null);
      }
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
              className={cn('input', { 'is-danger': error })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {query && error && (
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
              disabled={!query}
              className={cn('button is-light', { 'is-loading': loading })}
              onClick={handleSearch}
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
                onClick={handleAdd}
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
          <MovieCard movie={movie as Movie} />
        </div>
      )}
    </>
  );
};
