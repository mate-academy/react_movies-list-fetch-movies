import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: (value: any) => void,
};


export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<Movie | undefined>();
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultPicture
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const addMovieOnClick = () => {
    setMovies((prevArray: Movie[]) => {
      const uniqMovieStatus = [...prevArray].some(
        item => item.imdbId === search?.imdbId,
      );

      if (uniqMovieStatus) {
        return prevArray;
      }

      return [...prevArray, search];
    });

    setSearch(undefined);
    setIsLoading(false);
    setIsFailed(false);
  };

  const loadMovie = async () => {
    setIsLoading(true);
    const movie = await getMovie(query);

    if ('Error' in movie) {
      setIsFailed(true);
    } else {
      setSearch({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster === 'N/A' ? defaultPicture : movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });

      setIsFailed(false);
    }

    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          loadMovie();
        }}
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
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {isFailed && query === '' && (
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
              className={classnames({
                button: true,
                'is-light': true,
                'is-loading': isLoading && !search && !isFailed,
              })}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {search && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieOnClick}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {search && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={search} />
        </div>
      )}
    </>
  );
};
