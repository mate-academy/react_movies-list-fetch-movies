import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  setMoviesList: React.Dispatch<React.SetStateAction<Movie[]>>;
  moviesList: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMoviesList, moviesList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnyError, setError] = useState(false);
  const [isSearchBefore, setIsSearchBefore] = useState(false);
  // const [existingImdbId, setExistingImdbId] = useState<string[] | []>([]);

  const defPicUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSearchBefore(true);
    setIsLoading(true);

    try {
      await getMovie(title)
        .then(data => {
          if ('Error' in data) {
            throw Error(data.Error);
          } else {
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl: data.Poster === 'N/A' ? defPicUrl : data.Poster,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
          }
        });
    } catch (errorName) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddButton = () => {
    if (movie) {
      if (!moviesList.find(obj => obj.imdbId === movie.imdbId)) {
        setMoviesList(current => [...current, movie]);
      }

      setIsSearchBefore(false);
      setTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>

          {isAnyError && (
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
              disabled={!title}
            >
              {isSearchBefore ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {isSearchBefore && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            )}
          </div>
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
