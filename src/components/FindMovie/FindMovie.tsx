import classNames from 'classnames';
import {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useState,
} from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [find, setFind] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorTitle, setIsErrorTitle] = useState(false);

  const findMovie = (e: SyntheticEvent<EventTarget>) => {
    if (find) {
      e.preventDefault();
      setIsLoading(true);
      const defaultImg
        = 'https://via.placeholder.com/360x270.png?text=no%20preview';

      getMovie(find).then(res => {
        if (res.Response === 'False') {
          setMovie(null);
          setIsErrorTitle(true);

          return;
        }

        setMovie({
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster
            || defaultImg,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          imdbId: res.imdbID,
        });

        setIsErrorTitle(false);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFind(e.target.value);
    setMovie(null);
    setIsErrorTitle(false);
  };

  const handleSubmit = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setFind('');
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
              className="input is-dander"
              value={find}
              onChange={handleInput}
            />
          </div>
          {
            isErrorTitle && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!find}
              onClick={findMovie}
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
                onClick={handleSubmit}
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
