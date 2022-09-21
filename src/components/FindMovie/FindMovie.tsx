import classNames from 'classnames';
import { FC, SyntheticEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const emptyMovie = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };
  const [find, setFind] = useState('');
  const [movie, setMovie] = useState<Movie>(emptyMovie);
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isErrorTitle, setIsErrorTitle] = useState(false);

  const findMovie = (e: SyntheticEvent<EventTarget>) => {
    if (find) {
      e.preventDefault();
      setIsLoading(true);
      const defaultImg
        = 'https://via.placeholder.com/360x270.png?text=no%20preview';

      getMovie(find).then(res => {
        if (res.Response === 'False') {
          setMovie(emptyMovie);
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
        setIsFound(true);
        setIsLoading(false);
      }).finally(() => {
        setIsLoading(false);
      });
    }
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
              onChange={e => {
                setFind(e.target.value);
                setIsFound(false);
                setIsErrorTitle(false);
              }}
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

          {isFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
                  setMovie(emptyMovie);
                  setFind('');
                  setIsFound(false);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {isFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
