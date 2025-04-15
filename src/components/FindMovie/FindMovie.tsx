import React, { useState, useRef } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const normalizeMovieData = (data: MovieData): Movie => {
    return {
      title: data.Title,
      description:
        data.Plot !== 'N/A' ? data.Plot : 'No description available.',
      imgUrl:
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setError('');
    setIsLoading(true);
    setPreview(null);

    try {
      const data = await getMovie(title);

      if ('Error' in data) {
        setError("Can't find a movie with such a title");

        return;
      } else {
        const normalizedMovie = normalizeMovieData(data);

        setPreview(normalizedMovie);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    const alreadyInList = movies.some(movie => movie.imdbId === preview.imdbId);

    if (!alreadyInList) {
      setMovies([...movies, preview]);
    }

    if (formRef.current) {
      formRef.current.reset();
    }

    setTitle('');
    setPreview(null);
  };

  return (
    <>
      <form ref={formRef} className="find-movie" onSubmit={handleSubmit}>
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
              className="input is-danger"
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim() || isLoading}
            >
              Find a movie
            </button>
          </div>

          {preview && !isLoading && (
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
          <MovieCard movie={preview} />
        </div>
      )}

      {movies.length > 0 && (
        <div className="movie-list">
          {movies.map(movie => (
            <MovieCard movie={movie} key={movie.imdbId} />
          ))}
        </div>
      )}
    </>
  );
};
