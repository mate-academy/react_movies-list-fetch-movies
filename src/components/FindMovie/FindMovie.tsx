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
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [failedRequest, setFailedRequest] = useState(false);

  const addMovie = async (query: string) => {
    const film = await getMovie(query);

    if ('Title' in film) {
      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = film;

      if (film.Poster === 'N/A') {
        setMovie({
          title: Title,
          description: Plot,
          imgUrl: 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      } else {
        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      }
    } else {
      setFailedRequest(true);
    }

    setLoading(false);
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
              value={request}
              onChange={(event) => {
                setRequest(event.target.value);
                setFailedRequest(false);
              }}
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
                disabled={!request.length}
                onClick={() => {
                  addMovie(request);
                  setLoading(true);
                }}
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
                  disabled={!request.length}
                  onClick={() => {
                    addMovie(request);
                    setLoading(true);
                  }}
                >
                  Search again
                </button>
              </div>

              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => {
                    setMovies(movie);
                    setRequest('');
                    setMovie(undefined);
                  }}
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
