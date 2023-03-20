import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MoviesList } from '../MoviesList';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';

export const FindMovie: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setIsError(false);
  };

  const handleClickSearch = () => {
    setIsLoading(true);
    getMovie(searchValue).then(res => {
      setIsLoading(false);
      if ('Error' in res) {
        setIsError(true);
      } else {
        const foundMovie: Movie = {
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster !== 'N/A'
            ? res.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          imdbId: res.imdbID,
        };

        setMovie(foundMovie);
        setSearchValue('');
      }
    });
  };

  const handleAddMovie = (m: Movie) => () => {
    const foundedMovie = movies.find(item => item.imdbId === m.imdbId);

    if (!foundedMovie) {
      setMovies([...movies, m]);
    }

    setSearchValue('');
    setIsError(false);
    setMovie(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <form className="find-movie" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="movie-title">
                Movie title
              </label>

              <div className="control">
                <input
                  data-cy="titleField"
                  type="text"
                  id="movie-title"
                  value={searchValue}
                  onChange={handleChangeSearch}
                  placeholder="Enter a title to search"
                  className="input is-dander"
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
                  className={classNames('button is-light',
                    { 'is-loading': isLoading })}
                  onClick={handleClickSearch}
                  disabled={!searchValue}
                >
                  {
                    !movie
                      ? 'Find a movie'
                      : 'Search again'
                  }
                </button>
              </div>

              <div className="control">
                {movie && (
                  <button
                    data-cy="addButton"
                    type="button"
                    className="button is-primary"
                    onClick={handleAddMovie(movie)}
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
        </div>
      </div>
    </>
  );
};
