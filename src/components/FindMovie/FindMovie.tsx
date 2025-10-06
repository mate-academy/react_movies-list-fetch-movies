import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
// import classNames from 'classnames';

type Props = {
  onAdd: (movie: Movie) => boolean;
};

function isResponseError(x: MovieData | ResponseError): x is ResponseError {
  return ('Response' in x && x.Response === 'False') || 'Error' in x;
}

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

const normalizeToMovie = (data: MovieData): Movie => ({
  imdbId: data.imdbID,
  title: data.Title,
  description: data.Plot,
  imgUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
});

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setPreview(null);

    try {
      const res = await getMovie(title.trim());

      if (!res || isResponseError(res)) {
        setError("Can't find a movie with such a title");

        return;
      } else {
        setPreview(normalizeToMovie(res));
      }
    } catch {
      setError("Can't find a movie with such a title");
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
    setError('');
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
              className={`input  ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) {
                  setError('');
                }
              }}
            />
          </div>

          {error && (
            <p
              className={`help is-danger ${error ? '' : 'is-hidden'}`}
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
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
          {preview && <MovieCard movie={preview} />}
        </div>
      )}
    </>
  );
};
