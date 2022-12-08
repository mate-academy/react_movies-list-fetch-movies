import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';

type Props = {
  onMovieAdd: (movies: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setIsLoaded(false);
    setTitle(query);
  };

  const findMovie = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const result = await getMovie(title);

    setIsLoaded(true);
    setIsLoading(false);

    if ('Title' in result) {
      const foundMovie: Movie = {
        title: result.Title,
        description: result.Plot,
        imgUrl: result.Poster,
        imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        imdbId: result.imdbID,
      };

      setMovie(foundMovie);
    } else {
      setMovie(null);
    }
  };

  const onSearchHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    findMovie(event);
    setIsLoading(true);
    setIsSearched(true);
  };

  const onMovieAddHandler = () => {
    if (movie) {
      onMovieAdd(movie);
      setMovie(null);
      setTitle('');
      setIsLoaded(false);
      setIsSearched(false);
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
              onChange={onInputChangeHandler}
            />
          </div>

          {(isLoaded && !movie) && (
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
              onClick={onSearchHandler}
              disabled={!title}
            >
              {!isSearched ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {(movie) && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onMovieAddHandler}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
