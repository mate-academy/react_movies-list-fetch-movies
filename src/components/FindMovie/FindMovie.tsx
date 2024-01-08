import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  handler: (movie: Movie | undefined) => void
};

export const FindMovie: React.FC<Props> = ({ handler }) => {
  const [movie, setMovie] = useState<Movie>();
  const [loader, setLoader] = useState(false);
  const [query, setQuery] = useState('');
  const [hasTitleError, setHasTitleError] = useState('');

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasTitleError('');
  };

  const queryNormalize = query.trim();

  const normalize = (newMovie: MovieData) => {
    const {
      Poster,
      Title,
      Plot,
      imdbID,
    } = newMovie;

    const link = 'https://via.placeholder.com/360x270.png?text=no%20preview';

    if (Poster === 'N/A') {
      /* eslint-disable no-param-reassign */
      newMovie.Poster = link;
    }

    setMovie(
      {
        title: Title,
        description: Plot,
        imgUrl: newMovie.Poster,
        imdbUrl: '',
        imdbId: imdbID,
      },
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);
    getMovie(queryNormalize.toLowerCase())
      .then(((newMovie: MovieData | ResponseError) => {
        if ('Error' in newMovie) {
          setHasTitleError(`Can${'\''}t find a movie with such a title`);
        } else {
          normalize(newMovie);
        }
      }))
      .finally(() => setLoader(false));
  };

  const handlerClick = () => {
    handler(movie);
    setHasTitleError('');
    setMovie(undefined);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-danger"
              value={query}
              onChange={handleQuery}
            />
          </div>

          {(!movie && hasTitleError)
            && (
              <p className="help is-danger" data-cy="errorMessage">
                {hasTitleError}
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loader,
              })}
              disabled={!queryNormalize}
            >
              Find a movie
            </button>
          </div>

          {movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handlerClick}
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
