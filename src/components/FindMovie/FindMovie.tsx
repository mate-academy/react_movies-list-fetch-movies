import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

type Props = {
  onAdd: (newMovie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(false);

  const defaultImg = useMemo(() => 'https://via.placeholder.com'
    + '/360x270.png?text=no%20preview', []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    setLoading(true);

    const movieFromServer = await getMovie(title)
      .finally(() => setLoading(false));

    if ('Error' in movieFromServer) {
      setIsError(true);
    } else {
      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = movieFromServer;

      setIsFound(true);
      setMovie(() => ({
        title: Title,
        description: Plot,
        imgUrl: Poster === 'N/A'
          ? defaultImg
          : Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
        imdbId: imdbID,
      }));
    }
  };

  const reset = () => {
    setTitle('');
    setIsFound(false);
    setMovie(null);
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
              className="input is-dander"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
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
                { 'is-loading': loading },
              )}
              disabled={!title.length}
            >
              {isFound ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {isFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(movie);
                  reset();
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
