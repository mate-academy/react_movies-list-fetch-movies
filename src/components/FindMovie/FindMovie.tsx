import React, {
  useState,
} from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const getMovieData = (movieTitle: string) => {
    setIsloading(true);
    setIsError(false);
    getMovie(movieTitle)
      .then((newMovieData: MovieData | ResponseError) => {
        if ('imdbID' in newMovieData) {
          setMovie({
            title: newMovieData.Title,
            description: newMovieData.Plot,
            imgUrl: newMovieData.Poster
              ? newMovieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${newMovieData.imdbID}`,
            imdbId: newMovieData.imdbID,
          });
        } else {
          setIsError(true);
        }
      })
      .finally(() => setIsloading(false));
  };

  const handleFindMovie = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (isError) {
      setIsError(false);
    }

    getMovieData(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isError) {
      setIsError(false);
    }

    setTitle(e.target.value);
  };

  const addMovieToList = (newMovie: Movie) => {
    const newMovieId = newMovie.imdbId;
    const moviesIds = movies.map(m => m.imdbId);

    if (!moviesIds.includes(newMovieId)) {
      setMovies([...movies, newMovie]);
    }

    setMovie(null);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovieToList(movie);
    }

    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
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
              onChange={handleTitleChange}
              value={title}
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
              className={cn('button is-light',
                { 'is-loading': isLoading })}
              disabled={!title}
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
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
