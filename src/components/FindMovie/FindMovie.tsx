import classNames from 'classnames';

import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const imdbLink = 'https://www.imdb.com/title';
const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  setFoundMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setFoundMovie }) => {
  const [isError, setIsError] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [movieFromServer, setMovieFromServer] = useState<
  MovieData | ResponseError | null>(null);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
    setIsError(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const movie = await getMovie(searchInputValue.trim());

      if ('Response' in movie && movie.Response === 'False') {
        setIsError(true);
        setMovieFromServer(null);
      } else {
        setIsError(false);
        setMovieFromServer(movie);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (movieFromServer && 'Title' in movieFromServer) {
      const movieData: Movie = {
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster && movieFromServer.Poster !== 'N/A'
          ? movieFromServer.Poster
          : defaultImg,
        imdbUrl: `${imdbLink}/${movieFromServer.imdbID}`,
        imdbId: movieFromServer.imdbID,
      };

      setNewMovie(movieData);
    }
  }, [movieFromServer]);

  const handleMovieAdd = () => {
    if (newMovie) {
      setFoundMovie(newMovie);
      setSearchInputValue('');
      setMovieFromServer(null);
      setNewMovie(null);
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
              className={classNames('input', { 'is-danger': isError })}
              value={searchInputValue}
              onChange={handleInputChange}
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
              className={classNames(
                'button', 'is-light', { 'is-loading': isLoading },
              )}
              onClick={handleFormSubmit}
              disabled={searchInputValue === ''}
            >
              {!newMovie ? (
                'Find a movie'
              ) : (
                'Search again'
              )}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
