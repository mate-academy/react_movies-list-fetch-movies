import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

interface Props {
  addMovie: (arg: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;

  const [query, setQuery] = useState('');
  const [uploadedMovie, setUploadedMovie] = useState<Movie | null>(null);
  const [movieIsUploading, setMovieIsUploading] = useState(false);
  const [hasError, setHasError] = useState('');

  const findMovie = (event: FormEvent) => {
    event.preventDefault();
    setMovieIsUploading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          return Promise.reject(response.Error);
        }

        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = response;

        setUploadedMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });

        return Promise.resolve();
      })
      .catch(error => setHasError(error))
      .finally(() => setMovieIsUploading(false));

    setQuery('');
    setHasError('');
  };

  const addMovieToTheCollection = () => {
    if (uploadedMovie) {
      addMovie(uploadedMovie);
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHasError('');
              }}
            />
          </div>

          {hasError && (
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
                'button is-light', { 'is-loading': movieIsUploading },
              )}
              onClick={findMovie}
              disabled={query.length < 1}
            >
              Find a movie
            </button>
          </div>

          {uploadedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovieToTheCollection();
                  setUploadedMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {uploadedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={uploadedMovie} />
        </div>
      )}
    </>
  );
};
