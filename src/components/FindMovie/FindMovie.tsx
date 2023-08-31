import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
// import { loadMovie } from '../../functions/loadMovie';
import { handleAddMovieToList } from '../../functions/handleAddMovieToList';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

interface Props {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [queryTitle, setQueryTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movieFoundError, setMovieFoundError] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFindingAgain, setIsFindingAgain] = useState<boolean>(false);
  const [movieWasAskedOnce, setMovieWasAskedOnce] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieFoundError(false);
    setQueryTitle(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // loadMovie(
    //   queryTitle,
    //   setMovieFoundError,
    //   setMovie,
    //   setIsFindingAgain,
    //   setIsLoading,
    //   setMovieWasAskedOnce,
    // );
  };

  const loadMovie = (
    // queryTitle: string,
    // setMovieFoundError: React.Dispatch<React.SetStateAction<boolean>>,
    // setMovie: React.Dispatch<React.SetStateAction<Movie | null>>,
    // setIsFindingAgain: React.Dispatch<React.SetStateAction<boolean>>,
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    // setMovieWasAskedOnce: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const defaultPic
    = 'https://dummyimage.com/360x270/e3e3e3/000000&text=no+preview';

    setIsLoading(true);

    getMovie(queryTitle.trim())
      .catch(() => setMovieFoundError(true))
      .then(movieFromServer => {
        const { Response } = movieFromServer as ResponseError;

        if (Response !== 'False') {
          const {
            Title, Poster, Plot, imdbID,
          } = movieFromServer as MovieData;

          const newMovie: Movie = {
            title: Title,
            imgUrl: Poster || defaultPic,
            description: Plot,
            imdbId: imdbID,
            imdbUrl: imdbID ? `https://www.imdb.com/title/${imdbID}` : defaultPic,
          };

          setMovie(newMovie);
        } else {
          setMovieFoundError(true);
          setIsFindingAgain(false);
          setMovie(null);
        }

        setIsLoading(false);
        setMovieWasAskedOnce(true);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnSubmit}
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
              className={`input ${movieFoundError && 'is-danger'}`}
              value={queryTitle}
              onChange={handleInputChange}
            />
          </div>

          {movieFoundError && (
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={queryTitle.trim().length === 0}
              onClick={() => loadMovie()}
            >
              {movieWasAskedOnce ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie !== null && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleAddMovieToList(
                    movies,
                    movie,
                    setMovies,
                    setMovie,
                    setQueryTitle,
                  );
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie !== null && !movieFoundError && !isFindingAgain && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
