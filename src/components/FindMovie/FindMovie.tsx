import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
};

const DEFAULT_POSTER_LINK =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

const normalizeMovieData = (data: MovieData): Movie => ({
  imgUrl: data.Poster === 'N/A' ? DEFAULT_POSTER_LINK : data.Poster,
  title: data.Title,
  description: data.Plot,
  imdbId: data.imdbID,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
});

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMovie(title.trim());

      if ('Error' in data) {
        setError(data.Error);
        setMovie(null);
      } else {
        setMovie(normalizeMovieData(data));
      }
    } catch {
      setError('Failed, try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (movie) {
      onAdd(movie);

      setTitle('');
      setError(null);
      setMovie(null);
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={handleTitleChange}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          {movie ? (
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
          ) : null}
        </div>
      </form>

      {movie ? (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      ) : null}
    </>
  );
};
