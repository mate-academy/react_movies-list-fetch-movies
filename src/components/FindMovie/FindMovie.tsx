import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

interface Props {
  addMovieToList: (updater: (prev: Movie[]) => Movie[]) => void;
}

const defaultPoster =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [suggestedMovie, setSuggestedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieTitle.trim()) {
      return;
    }

    setIsLoading(true);
    setError(false);

    getMovie(movieTitle)
      .then(movieData => {
        if ('Response' in movieData && movieData.Response === 'False') {
          setSuggestedMovie(null);
          setError(true);

          return;
        }

        const data = movieData as MovieData;

        const movie: Movie = {
          title: data.Title,
          description: data.Plot || 'No description',
          imgUrl: data.Poster !== 'N/A' ? data.Poster : defaultPoster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };

        setSuggestedMovie(movie);
        setError(false);
      })
      .catch(() => {
        setSuggestedMovie(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddingMovieToList = () => {
    if (!suggestedMovie) {
      return;
    }

    addMovieToList(prev => {
      const exists = prev.some(movie => movie.imdbId === suggestedMovie.imdbId);

      if (exists) {
        return prev;
      }

      return [...prev, suggestedMovie];
    });

    setSuggestedMovie(null);
    setMovieTitle('');
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
              value={movieTitle}
              onChange={e => {
                setMovieTitle(e.target.value);
                setError(false);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
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
                'is-loading': isLoading,
              })}
              disabled={!movieTitle.trim()}
            >
              Find a movie
            </button>
          </div>

          {suggestedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddingMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {suggestedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={suggestedMovie} />
        </div>
      )}
    </>
  );
};
