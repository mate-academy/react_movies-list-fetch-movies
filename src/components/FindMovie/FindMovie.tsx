import classNames from 'classnames';
import React, { ChangeEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setError] = useState(false);
  const [hasLoaded, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.replace(/[^a-zA-Z_0-9-]/g, ''));
    setError(false);
  };

  const handleFind = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);
      const current = await getMovie(query);

      if ('Error' in current) {
        setError(true);
        setLoading(false);

        return;
      }

      const correctimgUrl = current.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : current.Poster;

      const foundedMovie = {
        title: current.Title,
        description: current.Plot,
        imgUrl: correctimgUrl,
        imdbUrl: `https://www.imdb.com/title/${current.imdbID}`,
        imdbId: current.imdbID,
      };

      setMovie(foundedMovie);
    } finally {
      setError(false);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setError(false);
    setMovie(null);
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
              value={query}
              onChange={handleChange}
              placeholder="Enter a title to search"
              className={classNames('input',
                { 'is-dander': hasError })}
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
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': hasLoaded })}
            >
              Find a movie
            </button>
          </div>

          {movie && (
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
