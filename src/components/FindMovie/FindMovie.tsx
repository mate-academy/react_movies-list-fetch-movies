import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import cn from 'classnames';

interface Props {
  handleAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchInput)
      .then(res => {
        if ('Error' in res) {
          setHasError(true);
          return;
        }

        const { Title, Plot, Poster, imdbID } = res;

        const imgUrl =
          Poster !== 'N/A'
            ? Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview';

        const movie = {
          title: Title,
          description: Plot,
          imgUrl: imgUrl,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setSearchedMovie(movie);
      })
      .finally(() => setIsLoading(false));
  };

  const onMovieAdd = () => {
    if (searchedMovie) {
      handleAddMovie(searchedMovie);
      setSearchedMovie(null);
      setSearchInput('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearchSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              value={searchInput}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': hasError })}
              onChange={event => {
                setHasError(false);
                setSearchInput(event.target.value.trimStart());
              }}
            />
          </div>

          {hasError && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!searchInput}
            >
              Find a movie
            </button>
          </div>

          {searchedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onMovieAdd}
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
