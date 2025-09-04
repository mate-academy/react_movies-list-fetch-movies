import './FindMovie.scss';
import { useState } from 'react';

import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

import cn from 'classnames';
import { MovieData } from '../../types/MovieData';

type Props = {
  handleAddToList: (pickedMovie: Movie) => void;
  moviesTitles: string[];
};

export const FindMovie: React.FC<Props> = ({
  handleAddToList,
  moviesTitles,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSearchQuery = (value: string) => {
    setSearchQuery(value);
    setIsError(false);
  };

  const getData = async (searchedMovie: string) => {
    try {
      setIsLoading(true);
      const requestedData: MovieData = await getMovie(searchedMovie);

      if (
        !requestedData.Title.toUpperCase().includes(searchQuery.toUpperCase())
      ) {
        setIsError(true);
        setIsLoading(false);

        return;
      }

      const normalizedMovieData: Movie = {
        title: requestedData.Title,
        description: requestedData.Plot,
        imgUrl:
          requestedData.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : requestedData.Poster,
        imdbUrl: `https://www.imdb.com/title/${requestedData.imdbID}`,
        imdbId: requestedData.imdbID,
      };

      setPreviewMovie(normalizedMovieData);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      // throw error;
    } finally {
      setIsLoading(false);
      setSearchQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(searchQuery.trim());
  };

  const onHandleAddToList = () => {
    if (previewMovie) {
      const isDublicate = moviesTitles.includes(previewMovie.imdbId);

      if (isDublicate) {
        setSearchQuery('');
        setPreviewMovie(null);
        setSearchQuery('');

        return;
      }

      handleAddToList(previewMovie);
      setSearchQuery('');
    }

    setPreviewMovie(null);
    setSearchQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e)}>
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
              className="input is-danger"
              value={searchQuery}
              onChange={e => handleSearchQuery(e.target.value)}
              disabled={isLoading}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!searchQuery}
            >
              Find a movie
            </button>
          </div>

          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onHandleAddToList()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!!previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
