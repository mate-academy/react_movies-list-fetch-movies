import React, { useState } from 'react';
import './FindMovie.scss';
import { FindMovieProps } from '../../types/FindMovieProps';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie, movies }) => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setError('');
  };

  const normalizeMovie = (movieData: MovieData): Movie => ({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl:
      movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  });

  const handleClickFindMovie = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMovie(searchValue);

      if ('Error' in response) {
        setError("Can't find a movie with such a title");
        setMovie(null);

        return;
      }

      const normalizedMovie = normalizeMovie(response);

      setMovie(normalizedMovie);
    } catch (e) {
      setError('An error occurred while fetching the movie');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    const isMovieExits = movies.some(e => e.imdbId === movie.imdbId);

    if (!isMovieExits) {
      onAddMovie(movie);
    }

    setSearchValue('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
          handleClickFindMovie();
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
              placeholder={cn('input', { 'is-danger': error })}
              value={searchValue}
              className="input is-danger"
              onChange={handleChangeInput}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={searchValue.length === 0}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
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
