import { FC, memo, useState } from 'react';
import cn from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void
};

export const FindMovie: FC<Props> = memo(({ onAddMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchQueryChange
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setErrorMessage('');
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await getMovie(searchQuery.trim());

      if ('Error' in response) {
        throw new Error(response.Error);
      }

      const {
        Title, Poster, Plot, imdbID,
      } = response;

      setFoundMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBtnClick = () => {
    if (foundMovie) {
      onAddMovie(foundMovie);
    }

    setSearchQuery('');
    setFoundMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => handleSubmit(event)}>
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
              onChange={handleSearchQueryChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!searchQuery.trim()}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddBtnClick}
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
});
