import React, { Dispatch, SetStateAction } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

const posterNotFoundUrl =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

interface FindMovieProps {
  title: string;
  setTitle: (title: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  movie: Movie | null;
  setMovie: Dispatch<SetStateAction<Movie | null>>;
  movies: Movie[];
  setMovies: Dispatch<SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<FindMovieProps> = ({
  title,
  setTitle,
  isLoading,
  setIsLoading,
  error,
  setError,
  movie,
  setMovie,
  movies,
  setMovies,
}) => {
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setError(data.Error);
          setMovie(null);
        } else {
          const newMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster !== 'N/A' ? data.Poster : posterNotFoundUrl,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(newMovie);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (movie && !movies.some(m => m.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
      setTitle('');
      setMovie(null);
    } else {
      setTitle('');
      setMovie(null);
    }
  };

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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setError(null);
              }}
            />
          </div>

          {error && (
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
              disabled={!title}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
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
