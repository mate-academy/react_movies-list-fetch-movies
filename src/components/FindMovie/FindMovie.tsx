import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [movieIsNotFound, setMovieIsNotFound] = useState(false);
  const [query, setQuery] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieIsNotFound(false);
    setQuery(event.currentTarget.value);
  };

  const convertMovie = ({
    Poster,
    Title,
    Plot,
    imdbID,
  }: MovieData) => ({
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  });

  const findMovie = async (inputQuery: string) => {
    setIsLoading(true);
    setMovieIsNotFound(false);
    const response = await getMovie(inputQuery) as MovieData;

    if (!response.Title) {
      setMovieIsNotFound(true);
      setSearchedMovie(null);
    } else {
      const movie = convertMovie(response);

      setSearchedMovie(movie);
    }

    setIsLoading(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMovieIsNotFound(false);
    setIsLoading(true);
    findMovie(query);
  };

  const addMovie = () => {
    const alreadyAdded = movies.some(
      movie => movie.imdbId === searchedMovie?.imdbId,
    );

    if (movies && searchedMovie && !alreadyAdded) {
      setMovies([...movies, searchedMovie]);
    }

    setSearchedMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
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
              className={classNames('input', {
                'is-danger': movieIsNotFound,
              })}
              value={query}
              onChange={handleChange}
            />
          </div>

          {movieIsNotFound && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={query.length === 0}
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
                onClick={addMovie}
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
