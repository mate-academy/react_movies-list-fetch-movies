import React, { useState, useCallback } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addToMovieList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addToMovieList }) => {
  const [inputValue, setInputValue] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleAddToMovieList() {
    setInputValue('');
    setNewMovie(null);
    setIsSearched(false);
    setIsError(false);

    if (newMovie !== null) {
      addToMovieList(newMovie);
    }
  }

  const handleSearch = useCallback((key: string) => {
    setIsLoading(true);

    getMovie(key)
      .then(movieData => {
        if ('Error' in movieData) {
          setIsError(true);
          setIsLoading(false);
        } else {
          const movie: Movie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          setNewMovie(movie);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsSearched(true);
      });
  }, []);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          handleSearch(inputValue);
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={event => {
                setInputValue(event.target.value);
                setIsError(false);
              }}
              value={inputValue}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': false,
              })}
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
              disabled={inputValue.length === 0}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              {isSearched ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                onClick={handleAddToMovieList}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
