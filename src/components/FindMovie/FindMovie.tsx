import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    getMovie(searchQuery)
      .then(res => {
        if ('Error' in res) {
          setIsError(true);
        } else {
          setPreviewMovie({
            title: res.Title,
            description: res.Plot,
            imgUrl: res.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : res.Poster,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          });
        }
      })
      .finally(() => setIsSearching(false));
  };

  const handleSearchQuery = (value: string) => {
    setIsError(false);
    setSearchQuery(value);
  };

  const handleAddMovie = () => {
    addMovie(previewMovie as Movie);
    setSearchQuery('');
    setPreviewMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnSubmit}
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
              value={searchQuery}
              onChange={({ target }) => handleSearchQuery(target.value)}
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
              className={cn('button is-light', { 'is-loading': isSearching })}
              disabled={!searchQuery}
            >
              Find a movie
            </button>
          </div>

          { previewMovie && (
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

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {previewMovie && (<MovieCard movie={previewMovie} />)}
      </div>
    </>
  );
};
