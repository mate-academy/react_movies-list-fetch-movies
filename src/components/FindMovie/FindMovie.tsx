import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ResponseError } from '../../types/ReponseError';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [searchedFlag, setSearchedFlag] = useState(false);
  const [loading, seetLoading] = useState(false);
  const [add2List, setAdd2List] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setErrorFlag(false);
  }, [searchQuery]);

  useEffect(() => {
    if (foundMovie && !errorFlag) {
      setAdd2List(true);
    }
  }, [foundMovie]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    seetLoading(true);
    getMovie(searchQuery)
      .then(res => {
        setSearchedFlag(true);

        if ((res as ResponseError).Response === 'False') {
          setErrorFlag(true);
          setFoundMovie(null);
        } else {
          const movieData = res as MovieData;
          const normalizedMovie: Movie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster !== 'N/A'
                ? movieData.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          setFoundMovie(normalizedMovie);
        }
      })
      .finally(() => seetLoading(false));
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedFlag(false);
    setAdd2List(false);
    setErrorFlag(false);
    setFoundMovie(null);
    setSearchQuery('');

    if (foundMovie) {
      onMovieAdd(foundMovie);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
        onReset={handleReset}
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
              className={classNames('input', { 'is-danger': errorFlag })}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
          {errorFlag && (
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
                'is-loading': loading,
              })}
              disabled={!searchQuery}
            >
              {searchedFlag ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {add2List && (
              <button
                data-cy="addButton"
                type="reset"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
