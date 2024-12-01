import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const normalizeData = (data: MovieData): Movie => {
    const {
      Poster, Title, Plot, imdbID,
    } = data;

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster !== 'N/A'
        ? Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(title)
      .then(res => {
        if (Object.hasOwn(res, 'Error')) {
          throw new Error();
        }

        setMovie(normalizeData(res as MovieData));
      })
      .catch(() => setIsError(true))
      .finally(() => {
        setIsLoading(false);
        setTitle('');
      });
  };

  const handleOnAdd = () => {
    if (movie) {
      onAdd(movie);
    }

    setMovie(null);
  };

  const buttonText = movie
    ? 'Search again'
    : 'Find a movie';

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className="input"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {isError
            && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!title.trim()}
            >
              {buttonText}
            </button>
          </div>

          {movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleOnAdd}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
