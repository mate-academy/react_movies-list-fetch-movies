import React, { useEffect, useState } from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
}

const normalizeMovie = (data: MovieData) => {
  const { Poster, Title, Plot, imdbID } = data;

  return {
    title: Title,
    description: Plot,
    imgUrl:
      Poster !== 'N/A'
        ? Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');

  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query.trim())
      .then(result => {
        if ('Error' in result) {
          setMovieData(null);
          setIsValid(false);
        } else {
          setIsValid(true);
          setMovieData(result);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = (item: Movie) => {
    const { imdbId } = item;

    const isItemInMovies = movies.some(film => film.imdbId === imdbId);

    if (!isItemInMovies) {
      setMovies(current => [...current, item]);
    }

    setMovieData(null);
    setQuery('');
    setIsValid(true);
  };

  useEffect(() => {
    if (movieData) {
      const normalizedMovie = normalizeMovie(movieData);

      setMovie(normalizedMovie);
    } else {
      setMovie(null);
    }
  }, [movieData]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={cn('input', { 'is-danger': !isValid })}
              value={query}
              onChange={event => {
                setIsValid(true);
                setQuery(event.target.value.trimStart());
              }}
            />
          </div>

          {!isValid && (
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              {movieData ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
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
