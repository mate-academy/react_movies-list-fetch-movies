import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setPreviewMovie(null);

    try {
      const response = await getMovie(trimmedTitle);

      if ('Error' in response) {
        setErrorMessage("Can't find a movie with such a title");
      } else {
        const movie: Movie = {
          title: response.Title,
          description: response.Plot || '',
          imgUrl:
            response.Poster && response.Poster !== 'N/A'
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbId: response.imdbID,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        };

        setPreviewMovie(movie);
      }
    } catch {
      setErrorMessage("Can't find a movie with such a title");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (previewMovie) {
      onAddMovie(previewMovie);
      setTitle('');
      setPreviewMovie(null);
      setErrorMessage('');
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
              className={classNames('input', { 'is-danger': !!errorMessage })}
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', { 'is-loading': loading })}
              disabled={loading || !title.trim()}
            >
              Find a movie
            </button>
          </div>
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />

          <div className="field is-grouped mt-4">
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};