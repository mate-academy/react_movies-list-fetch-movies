/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/RepsonseError';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  function isMovieData(result: MovieData | ResponseError): result is MovieData {
    return (result as ResponseError).Response !== 'False';
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('handleOnSubmit called');

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setPreviewMovie(null);

    try {
      const result = await getMovie(title);

      if (!isMovieData(result)) {
        setError("Can't find a movie with such a title");
      } else {
        const normalized: Movie = {
          imdbId: result.imdbID,
          title: result.Title,
          description: result.Plot,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imgUrl:
            result.Poster !== 'N/A'
              ? result.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        };

        setPreviewMovie(normalized);
      }
    } catch {
      setError('Try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBtn = () => {
    if (!previewMovie?.imdbId.trim()) {
      return;
    }

    if (!movies.some(movie => movie.imdbId === previewMovie.imdbId)) {
      setMovies([...movies, previewMovie]);
    }

    setTitle('');
    setPreviewMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmit}>
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
              value={title}
              className={`input ${error ? 'is-danger' : ''}`}
              onChange={e => {
                setTitle(e.target.value);
                setError('');
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
              className={`button is-light  ${loading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
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
                onClick={handleAddBtn}
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
