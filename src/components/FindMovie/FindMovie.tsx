import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  addMovie: (movie: Movie) => void;
  existingMovies: Movie[];
};

function isMovieData(data: MovieData | ResponseError): data is MovieData {
  return (data as MovieData).imdbID !== undefined;
}

export const FindMovie: React.FC<Props> = ({ addMovie, existingMovies }) => {
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prevMovie, setPrevMovie] = useState<Movie | null>(null);

  const defaultPoster =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMovie(title.trim());

      if (isMovieData(data)) {
        setPrevMovie({
          title: data.Title,
          description: data.Plot || 'No description available',
          imgUrl: data.Poster !== 'N/A' ? data.Poster : defaultPoster,
          imdbId: data.imdbID,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        });
      } else {
        setError(data.Error || 'Error loading movie');
        setPrevMovie(null);
      }
    } catch {
      setError("Can't find a movie with such a title");
      setPrevMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (
      prevMovie &&
      !existingMovies.some(m => m.imdbId === prevMovie?.imdbId)
    ) {
      addMovie(prevMovie);
    }

    setTitle('');
    setPrevMovie(null);
    setError(null);
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
              className="input is-danger"
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setError(null);
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>
          {prevMovie && (
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
      {prevMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={prevMovie} />
        </div>
      )}
    </>
  );
};
