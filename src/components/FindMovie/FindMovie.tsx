/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC<{ onAdd?: (movie: Movie) => void }> = ({
  onAdd,
}) => {
  const [title, setTitle] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [previewMovie, setPreviewMovie] = React.useState<Movie | null>(null);

  const normalizeMovieData = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imdbId: data.imdbID,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imgUrl:
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
  });

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    setError(false);
    setLoading(true);

    getMovie(title)
      .then(movie => {
        if ('Response' in movie && movie.Response === 'False') {
          setError(true);
          setPreviewMovie(null);
        } else {
          setError(false);
          setPreviewMovie(normalizeMovieData(movie as MovieData));
        }
      })
      .catch(() => {
        setError(true);
        setPreviewMovie(null);
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (previewMovie && onAdd) {
      onAdd(previewMovie);
    }

    setTitle('');
    setPreviewMovie(null);
    setError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitForm}>
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
              className={error ? 'input is-danger' : 'input'}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) {
                  setError(false);
                }
              }}
            />
          </div>

          {error && (
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
              className={
                loading ? 'button is-link is-loading' : 'button is-link'
              }
              disabled={loading || title.trim().length === 0}
            >
              Find a movie
            </button>
          </div>

          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
