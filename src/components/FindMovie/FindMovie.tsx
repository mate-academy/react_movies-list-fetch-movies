import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasTitleError, setHasTitleError] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleFindMovie = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const movie = await getMovie(title);

      setLoading(false);
      setHasTitleError(false);

      if ('Error' in movie) {
        setHasTitleError(true);

        return;
      }

      setFoundMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
    } catch {
      setLoading(false);
    }
  };

  const reset = () => {
    setTitle('');
    setFoundMovie(null);
  };

  const handleAddMovie = () => {
    if (foundMovie) {
      onAddMovie(foundMovie);
      reset();
    }
  };

  return (
    <>
      <form className="find-movie">
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
              className="input is-dander"
              value={title}
              onChange={handleQuery}
            />
          </div>

          {hasTitleError && (
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
              className={cn('button', 'is-light', {
                'is-loading': loading,
              })}
              onClick={handleFindMovie}
              disabled={!title.trim().length}
            >
              {!foundMovie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
