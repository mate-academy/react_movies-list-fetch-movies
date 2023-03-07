/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isNotFindMovie, setNotFindMovie] = useState(false);

  const isEnabled = query;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const getNewMovie = ({
    Poster,
    Title,
    Plot,
    imdbID,
  }: MovieData) => {
    const newMovie = {
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imgUrl: Poster === 'N/A' ? 'https://via.placeholder.com/360x270.png?text=no%20preview' : Poster,
      imdbUrl: imdbID,
      id: Math.random(),
    };

    setMovie(newMovie);
  };

  const loadMovie = async () => {
    setLoading(true);
    try {
      const fetchMovie = await getMovie(query);

      if ('Error' in fetchMovie) {
        throw new Error('error');
      } else {
        getNewMovie(fetchMovie as MovieData);
      }
    } catch (error) {
      setNotFindMovie(true);
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => {
                setQuery(e.target.value);
                setNotFindMovie(false);
              }}
            />
          </div>

          {isNotFindMovie && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              onClick={loadMovie}
              disabled={!isEnabled}
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
                onClick={() => {
                  onAdd(movie);
                  setQuery('');
                  setMovie(null);
                }}
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
