import React, {
  Dispatch,
  useState,
  SetStateAction,
  FormEvent,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

interface T {
  setMovies: Dispatch<SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<T> = ({ setMovies }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieShown, setIsMovieShown] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const isError = !isLoading && movie === null && input !== '' && isMovieShown;

  const normalized = (data: MovieData | ResponseError) => {
    if ('Title' in data) {
      const imgUrl = data.Poster
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview';

      return {
        title: data.Title,
        description: data.Plot,
        imgUrl,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      };
    }

    return null;
  };

  const movieList = () => {
    setMovies((prevMovies) => {
      if (prevMovies.find(prevMovie => JSON.stringify(prevMovie)
        === JSON.stringify(movie))) {
        setInput('');

        return prevMovies;
      }

      if (prevMovies && movie) {
        setInput('');

        return [...prevMovies, movie];
      }

      setInput('');

      return prevMovies;
    });
    setMovie(null);
    setInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setIsMovieShown(true);

    getMovie(input).then((data) => (
      setMovie(normalized(data))
    )).finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setIsMovieShown(false);
              }}
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
              className={
                classNames('button is-light', { 'is-loading': isLoading })
              }
              disabled={input === ''}
            >
              {movie !== null ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={movieList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
