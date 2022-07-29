import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const findMovie = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    const loadedMovie = await getMovie(title);

    if (loadedMovie.Error) {
      setPreview(null);
      setError(true);
    } else {
      const movie = {
        title: loadedMovie.Title,
        description: loadedMovie.Plot,
        imgUrl: loadedMovie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : loadedMovie.Poster,
        imdbId: loadedMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}`,
      };

      setPreview(movie);
    }

    setLoading(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => findMovie(event)}>
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
                setError(false);
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
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={title === ''}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(preview);
                  setPreview(null);
                  setTitle('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {preview && <MovieCard movie={preview} />}
      </div>
    </>
  );
};
