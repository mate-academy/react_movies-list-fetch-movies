import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
}
export const FindMovie: React.FC<Props> = props => {
  const { setMovies, movies } = props;
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function isMovieData(data: MovieData | ResponseError): data is MovieData {
    return (data as MovieData).Title !== undefined;
  }

  const findMovie = async () => {
    setIsLoading(true);
    setError('');

    try {
      const movieData = await getMovie(query);

      if ('Response' in movieData && movieData.Response === 'False') {
        setError("Can't find a movie with such a title");

        return;
      }

      const defaultImg =
        'https://via.placeholder.com/360x270.png?text=no%20preview';

      if (isMovieData(movieData)) {
        setMovie({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster && movieData.Poster !== 'N/A'
              ? movieData.Poster
              : defaultImg,
          imdbId: movieData.imdbID,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        });
      }
    } catch {
      setError('Something went wrong ;-;');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    findMovie();
  };

  const handleSetMovies = (currentMovie: Movie) => {
    if (movies.find((m: Movie) => m.imdbId === currentMovie.imdbId)) {
      setMovie(null);

      return;
    }

    setMovies([...movies, currentMovie]);
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          handleSubmit(event);
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
              className={cn('input', { 'is-danger': error })}
              onChange={event => {
                setError('');
                setQuery(event.target.value);
              }}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleSetMovies(movie)}
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
