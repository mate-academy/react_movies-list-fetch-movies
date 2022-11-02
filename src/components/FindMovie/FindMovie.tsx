import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [hasNoSuchTitle, setHasNoSuchTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);

  // eslint-disable-next-line max-len
  const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await getMovie(query.trim());

      if ('Error' in response) {
        throw new Error('Sorry, no such film :(');
      } else {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = response;

        const poster = (Poster === 'N/A')
          ? defaultPicture
          : Poster;

        const preparedMovie = {
          title: Title,
          description: Plot,
          imgUrl: poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovieFromServer(preparedMovie);
      }
    } catch (error) {
      setHasNoSuchTitle(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasNoSuchTitle(false);
  };

  const handleAddClick = () => {
    onAddMovie(movieFromServer as Movie);
    setQuery('');
    setMovieFromServer(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
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
              value={query}
              onChange={handleInput}
            />
          </div>

          {hasNoSuchTitle && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              {!movieFromServer
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movieFromServer && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddClick}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movieFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFromServer} />
        </div>
      )}
    </>
  );
};
