import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
// import { MovieData } from '../../types/MovieData';
// import { MovieData } from '../../types/MovieData';

type Props = {
  handleAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    getMovie(title)
      .then(p => {
        if (p.Error) {
          setError(p.Error);
        } else {
          setError(null);
          const newMovie = {
            imgUrl:
              p.Poster !== 'N/A'
                ? p.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            title: p.Title,
            description: p.Plot,
            imdbUrl: p.imdbID,
          } as Movie;

          setMoviePreview(newMovie);
        }
      })
      .finally(() => setLoading(false));
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
              className={classNames('input', { 'is-danger': error !== null })}
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setError(null);
                setTitle(event.target.value);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
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
              disabled={title.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {moviePreview && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleAddMovie(moviePreview);
                  setTitle('');
                  setMoviePreview(null);
                  setError(null);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {moviePreview && <h2 className="title">Preview</h2>}
        {moviePreview && <MovieCard movie={moviePreview} />}
      </div>
    </>
  );
};
