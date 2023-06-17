import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdded: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAdded }) => {
  const [query, setQuery] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createMovie = (response: MovieData) => {
    const {
      Poster, Title, Plot, imdbID,
    } = response;

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };
  };

  const handleFindMovie = async () => {
    setIsLoading(true);

    try {
      const loadMovie = await getMovie(query);

      if ('Error' in loadMovie) {
        throw Error();
      } else {
        setSearchedMovie(createMovie(loadMovie));
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = (newMovie: Movie) => {
    onAdded(newMovie);
    setSearchedMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => event.preventDefault()}
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
              className={classNames(
                'input',
                { 'is-danger': isError },
              )}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {isError && (
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
              onClick={handleFindMovie}
            >
              {searchedMovie
                ? 'No movies found!'
                : 'Find a movie'}
            </button>
          </div>

          {searchedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(searchedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {searchedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchedMovie} />
        </div>
      )}
    </>
  );
};
