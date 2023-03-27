import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';

import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (element: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | undefined>();
  const [failedRequest, setFailedRequest] = useState(false);

  const addMovie = async (request: string) => {
    const film = await getMovie(request);

    if ('Title' in film) {
      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = film;

      setMovie({
        title: Title,
        description: Plot,
        imgUrl: (Poster !== 'N/A' ? Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview'),
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
    } else {
      setFailedRequest(true);
    }

    setLoading(false);
  };

  const searchMovie = () => {
    addMovie(query);
    setLoading(true);
  };

  const queryTittle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setFailedRequest(false);
  };

  const addMovieTolist = () => {
    if (movie) {
      setMovies(movie);
    }

    setQuery('');
    setMovie(undefined);
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
              className="input is-dander"
              value={query}
              onChange={queryTittle}
            />
          </div>

          {failedRequest && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          {!movie ? (
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className={classNames('button is-light',
                  { 'is-loading': loading })}
                disabled={!query.length}
                onClick={searchMovie}
              >
                Find a movie
              </button>
            </div>
          ) : (
            <div className="field is-grouped">
              <div className="control">
                <button
                  data-cy="searchButton"
                  type="submit"
                  className={classNames('button is-light',
                    { 'is-loading': loading })}
                  disabled={!query.length}
                  onClick={searchMovie}
                >
                  Search again
                </button>
              </div>

              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={addMovieTolist}
                >
                  Add to the list
                </button>
              </div>
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
