import './FindMovie.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

interface Props {
  movie: Movie | null,
  movies: Movie[],
  setMovie: (newMovie: Movie | null) => void,
  title: string,
  setTitle: (text: string) => void,
  setMovies: (movieArray: Movie[]) => void,
}

export const FindMovie: React.FC<Props> = ({
  movie,
  movies,
  setMovie,
  title,
  setTitle,
  setMovies,
}) => {
  const URL = 'https://www.imdb.com/title/';
  const [hasTitleError, setHasTitleError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEmpty = !title.trim().length;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleMovieAdd = (newMovie: Movie) => {
    const isMovieInArray = movies.some(currentMovie => (
      currentMovie.title === newMovie.title
    ));

    if (isMovieInArray) {
      setMovie(null);
      setTitle('');

      return;
    }

    setMovies([...movies, newMovie]);
    setMovie(null);
    setTitle('');
  };

  const handleFindMovie = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(title)
      .then((response: MovieData | ResponseError) => {
        const movieData = response as MovieData;

        if (!movieData.Title) {
          setHasTitleError(true);

          return;
        }

        const currentMovieData = {
          Poster: movieData.Poster,
          Title: movieData.Title,
          Plot: movieData.Plot,
          imdbID: movieData.imdbID,
        };

        setMovie({
          title: currentMovieData.Title,
          description: currentMovieData.Plot,
          imgUrl: currentMovieData.Poster,
          imdbUrl: `${URL}${currentMovieData.imdbID}`,
          imdbId: currentMovieData.imdbID,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form className="find-movie">
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
                'is-danger': hasTitleError,
              })}
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          {hasTitleError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={isEmpty}
              onClick={handleFindMovie}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
            <div className="is-loading" />
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleMovieAdd(movie)}
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
