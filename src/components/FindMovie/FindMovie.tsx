import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => boolean;
};

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

const normalizeMovie = (data: MovieData): Movie => ({
  imdbId: data.imdbID,
  title: data.Title,
  description: data.Plot,
  imgUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
});

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setPreview(null);

    try {
      const res = await getMovie(title.trim());

      if (
        !res ||
        (typeof res === 'object' && 'Error' in res) ||
        !(res as MovieData).imdbID
      ) {
        setErrorMessage(`Can't find a movie with such a title`);
      } else {
        setPreview(normalizeMovie(res as MovieData));
      }
    } catch {
      setErrorMessage(`Can't find a movie with such a title`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    onAdd(preview);
    setTitle('');
    setPreview(null);
    setErrorMessage('');
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
              className={`input  ${errorMessage ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
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
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
