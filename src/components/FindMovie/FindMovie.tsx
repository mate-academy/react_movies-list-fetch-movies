/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

interface Props {
  onAdd: (v: Movie) => void;
}

export const FindMovie: React.FC <Props> = (props) => {
  const { onAdd } = props;

  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (movie) {
      onAdd(movie);
      setQuery('');
      setMovie(null);
    }
  };

  const addMovie = () => {
    console.log('add');
    setIsLoading(true);
    getMovie(query.toLowerCase())
      .then((res) => {
        if ('Error' in res) {
          throw new Error('Something goes wrong');
        }

        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = res as MovieData;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });

        return Promise.resolve();
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
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
              type="search"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                if (isError) {
                  setIsError(false);
                }
              }}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {isError && 'Can`t find a movie with such a title'}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="button"
              className={cn('button is-light', isLoading && 'is-loading')}
              disabled={!query}
              onClick={addMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="submit"
              className="button is-primary"
              disabled={!movie}

            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
