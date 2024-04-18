import React, {
  ChangeEventHandler,
  FormEventHandler,
  useMemo,
  useState,
} from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

const DEAFULT_PICTURE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | ResponseError | null>(
    null,
  );

  const isError = useMemo(
    () => movieData && movieData.Response === 'False',
    [movieData],
  );

  const movie = useMemo(() => {
    if (!movieData || movieData.Response === 'False') {
      return null;
    }

    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster === 'N/A' ? DEAFULT_PICTURE : movieData.Poster,
      imdbId: movieData.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    };
  }, [movieData]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    setInputValue(e.target.value);
    setMovieData(null);
  };

  const handleAdd = () => {
    if (movie) {
      addMovie(movie);
      setInputValue('');
      setMovieData(null);
    }
  };

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    const search = inputValue.trim().toLowerCase();

    setIsLoading(true);

    getMovie(search).then(data => {
      setIsLoading(false);
      setMovieData(data);
    });
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              value={inputValue}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!inputValue.trim()}
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
