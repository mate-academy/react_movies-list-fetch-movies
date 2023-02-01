/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import 'bulma';

const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [hadFirstSearch, setHadFirstSearch] = useState(false);
  const [showError, setShowError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const getMovieByTitle = async (titleQuery: string) => {
    setLoading(true);
    const response = await getMovie(titleQuery);

    if (!response.hasOwnProperty('Error')) {
      const imdbUrl = `https://www.imdb.com/title/${response.imdbID}`;

      const newMovie = {
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl,
        imdbId: response.imdbID,
      };

      if (newMovie.imgUrl === 'N/A') {
        newMovie.imgUrl = defaultImg;
      }

      setMovie(newMovie);
    } else {
      setShowError(true);
    }

    setLoading(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();

          getMovieByTitle(query);
        }}
      >
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
                setShowError(false);
              }}
            />
          </div>

          {showError && (
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
              className={cn(
                'button is-light',
                {
                  'is-loading': loading,
                },
              )}
              onClick={() => {
                setHadFirstSearch(true);
              }}
              disabled={!query.length}
            >
              {hadFirstSearch
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {hadFirstSearch && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  setMovie(null);
                  setHadFirstSearch(false);
                  setQuery('');
                  if (movie) {
                    addMovie(movie);
                  }
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
