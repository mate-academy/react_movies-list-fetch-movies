import React, { useMemo, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [search, setSearch] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsError(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(search)
      .then((result => {
        if ('Error' in result) {
          setIsError(true);
        } else {
          setMovieData(result);
          setIsError(false);
        }
      }))
      .finally(() => setIsLoading(false));
  };

  const normalizeMovieData = (movieInfo: MovieData) => {
    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movieInfo;

    const baseImdbUrl = 'https://www.imdb.com/title/';
    const defaultImgUrl = (
      'https://via.placeholder.com/360x270.png?text=no%20preview'
    );

    return ({
      title: Title,
      description: Plot,
      imgUrl: Poster !== 'N/A' ? Poster : defaultImgUrl,
      imdbUrl: `${baseImdbUrl}${imdbID}`,
      imdbId: imdbID,
    });
  };

  const newMovie = useMemo(() => {
    if (movieData) {
      return normalizeMovieData(movieData);
    }

    return null;
  }, [movieData]);

  const clearForm = () => {
    setMovieData(null);
    setSearch('');
  };

  const handleClickAddButton = () => {
    const isNewMovieInMovies = movies.some(
      movie => movie.imdbId === newMovie?.imdbId,
    );

    if (newMovie && !isNewMovieInMovies) {
      setMovies((prevMovies) => [...prevMovies, newMovie]);
    }

    clearForm();
  };

  const canShowElement = !isError && movieData;

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
              className="input is-danger"
              value={search}
              onChange={handleSearch}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!search}
            >
              Find a movie
            </button>
          </div>
          {canShowElement && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClickAddButton}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>
      {canShowElement && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}

    </>
  );
};
