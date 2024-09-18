import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await getMovie(query);

      if ('Error' in result) {
        setError(true);
      } else {
        const newMovie = {
          title: result.Title,
          description: result.Plot,
          imgUrl:
            result.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : result.Poster,
          imdbUrl: 'https://www.imdb.com/title/' + result.imdbID,
          imdbId: result.imdbID,
        };

        setFindMovie(newMovie);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (error) {
      setError(false);
    }
  }

  function handleOnAdd() {
    if (findMovie) {
      onAddMovie(findMovie);
      setFindMovie(null);
      setQuery('');
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmit}>
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
              onChange={handleOnChange}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {findMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleOnAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findMovie} />
        </div>
      )}
    </>
  );
};
