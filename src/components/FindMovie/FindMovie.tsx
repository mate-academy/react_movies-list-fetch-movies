import React, { useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

const PLACEHOLDER = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [previewMovie, setPreviewMovie] = useState({} as Movie);

  const handleFindMovie = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    searchQuery: string,
  ) => {
    e.preventDefault();
    setLoading(true);

    getMovie(searchQuery)
      .then((data) => {
        if ('Error' in data) {
          setError(data.Error);
        } else {
          const movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A'
              ? PLACEHOLDER
              : data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setPreviewMovie(movie);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError('');
  };

  const handleAddMovie = () => {
    if (previewMovie) {
      onAddMovie(previewMovie);
      setPreviewMovie({} as Movie);
      setQuery('');
    }
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
              className={classNames(
                'input',
                { 'is-danger': !!error },
              )}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {!!error
            && (
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
                'button is-light',
                { 'is-loading': loading },
              )}
              disabled={!query}
              onClick={(e) => handleFindMovie(e, query)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {previewMovie.title
              && (
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleAddMovie}
                >
                  Add to the list
                </button>
              )}
          </div>
        </div>
      </form>
      {previewMovie.title
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={previewMovie} />
          </div>
        )}
    </>
  );
};
