import React from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;

  preview: Movie | null;
  setPreview: (movie: Movie | null) => void;

  error: string;
  setError: (value: string) => void;

  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  title,
  setTitle,
  setMovies,
  preview,
  setPreview,
  error,
  setError,
  isLoading,
  setIsLoading,
  movies,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await getMovie(title);

      if ('Error' in data) {
        setPreview(null);
        setError("Can't find a movie with such a title");
        return;
      }

      setPreview({
        imdbId: data.imdbID,
        title: data.Title,
        description: data.Plot,
        imgUrl:
          data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    const alreadyExists = movies.some(
      movie => movie.imdbId === preview.imdbId,
    );

    if (!alreadyExists) {
      setMovies(prev => [...prev, preview]);
    }

    setPreview(null);
    setTitle('');
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
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError('');
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
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
              disabled={!title.trim()}
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
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
