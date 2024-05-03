import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(true);

          return;
        }

        const movieData = data as MovieData;

        setPreviewMovie({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const addMovie = () => {
    setError(false);
    setQuery('');
    setPreviewMovie(null);

    const movieToAdd = previewMovie as Movie;

    if (movies.find(movie => movie.imdbId === movieToAdd.imdbId)) {
      return;
    }

    onAdd([...movies, movieToAdd]);
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={handleQueryChange}
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
                'is-loading': loading,
              })}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          {!loading && previewMovie && (
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

      {!loading && previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
