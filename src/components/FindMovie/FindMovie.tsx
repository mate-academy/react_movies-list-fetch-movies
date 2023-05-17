import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (newMovie: Movie) => void;
}

const baseImgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: FC<Props> = ({
  onAdd,
}) => {
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQueryChange = useCallback((value: string) => {
    setSearchQuery(value);

    if (value) {
      setHasError(false);
    }
  }, []);

  const handleAdd = useCallback(() => {
    if (selectedMovie) {
      onAdd(selectedMovie);
      setSelectedMovie(null);
      setSearchQuery('');
    }
  }, [selectedMovie]);

  const handleSubmit = useCallback(
    async (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);

      if (!searchQuery.trim()) {
        setHasError(true);
        setErrorMessage('Put the title please');
      }

      try {
        const receivedMovie = await getMovie(searchQuery);

        if ('Error' in receivedMovie) {
          setHasError(true);
          setErrorMessage('Can\'t find a movie with such a title');

          return;
        }

        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = receivedMovie;

        const imgMovieUrl = Poster !== 'N/A'
          ? Poster
          : baseImgUrl;

        const newMovie: Movie = {
          title: Title,
          description: Plot,
          imgUrl: imgMovieUrl,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setSelectedMovie(newMovie);
      } finally {
        setIsLoading(false);
      }
    }, [],
  );

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
              value={searchQuery}
              onChange={(event) => handleQueryChange(event.currentTarget.value)}
            />
          </div>

          {hasError && (
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
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!searchQuery}
            >
              {!selectedMovie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
