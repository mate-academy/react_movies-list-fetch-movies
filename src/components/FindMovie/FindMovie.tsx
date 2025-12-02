import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie, DEFAULT_POSTER_URL } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const normalizeMovie = (data: MovieData): Movie => ({
  title: data.Title,
  description: data.Plot,
  imgUrl:
    data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER_URL,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  imdbId: data.imdbID,
});

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
    setPreviewMovie(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setPreviewMovie(null);

    getMovie(title.trim())
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setErrorMessage(
            data.Error === 'Movie not found!'
              ? "Can't find a movie with such a title"
              : 'An API error occurred',
          );
          setPreviewMovie(null);
        } else {
          const normalizedMovie = normalizeMovie(data);

          setPreviewMovie(normalizedMovie);
          setErrorMessage('');
        }
      })
      .catch(() => {
        setErrorMessage('Unexpected network error occurred');
        setPreviewMovie(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (previewMovie) {
      onMovieAdd(previewMovie);
      setTitle('');
      setPreviewMovie(null);
    }
  };

  const isSubmitDisabled = !title.trim() || loading;

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
              className={`input ${errorMessage ? 'is-danger' : ''}`}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={isSubmitDisabled}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {previewMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
