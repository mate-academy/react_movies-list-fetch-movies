import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
  movies?: Movie[];
};

const cleanMovie: Movie = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies = [] }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie>(cleanMovie);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddToList = useCallback(() => {
    const movieExists = movies.some(
      existingMovie => existingMovie.imdbId === movie.imdbId,
    );

    if (!movieExists) {
      onAddMovie(movie);
    }

    setMovie(cleanMovie);
    setTitle('');
    setHasError(false);
  }, [movie, onAddMovie, movies]);

  const getMovieData = (movieTitle: string) => {
    setIsLoading(true);
    setHasError(false);

    getMovie(movieTitle)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setHasError(true);
          setMovie(cleanMovie);

          return;
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster && data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
        setHasError(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          getMovieData(title);
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
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
                setHasError(false);
              }}
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {hasError && (
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim() || isLoading}
            >
              Find a movie
            </button>
          </div>

          {movie.title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
