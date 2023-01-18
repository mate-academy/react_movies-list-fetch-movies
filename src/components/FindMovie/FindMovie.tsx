import React, { useState } from 'react';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import { getMovie } from '../../api';

import './FindMovie.scss';

type Props = {
  onAdd: (movies: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showErr, setShowErr] = useState(false);

  const fetchMovie = async () => {
    try {
      const data = await getMovie(query);

      if (!('Title' in data)) {
        setShowErr(true);
      } else {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = data;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: (Poster === 'N/A')
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      }
    } catch {
      setShowErr(true);
    } finally {
      setIsLoaded(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoaded(true);

    fetchMovie();
  };

  const addMovie = () => {
    onAdd(movie);
    setQuery('');
    setMovie(null);
    setIsLoaded(false);
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowErr(false);
              }}
            />
          </div>

          {showErr && (
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
                'is-loading': isLoaded,
              })}
              disabled={!query.length}
            >
              {(movie) ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
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

      {(movie !== null) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
