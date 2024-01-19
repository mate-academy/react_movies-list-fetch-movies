import React, { useContext, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieContext } from '../../Context';

type Props = {
  addToTheList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addToTheList }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const fmBUtton = title.length === 0;
  const {
    movie, setMovie, isLoading, setIsLoading,
  } = useContext(MovieContext);

  const transformDataMovie = (dataFromServer: MovieData | ResponseError)
  : Movie | undefined => {
    if ('Title' in dataFromServer) {
      let poster = '';

      if (dataFromServer.Poster.length === 3) {
        poster = 'https://via.placeholder.com/360x270.png?text=no%20preview';
      } else {
        poster = dataFromServer.Poster;
      }

      return {
        title: dataFromServer.Title,
        description: dataFromServer.Plot,
        imgUrl: poster,
        imdbUrl: `https://www.imdb.com/title/${dataFromServer.imdbID}`,
        imdbId: dataFromServer.imdbID,
      };
    }

    setError(true);

    return undefined;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(title).then(mov => {
      setMovie(transformDataMovie(mov));
    }).finally(() => setIsLoading(false));
  };

  const handleAddToTheList = () => {
    if (movie !== undefined) {
      addToTheList(movie);
      setMovie(undefined);
      setTitle('');
    }
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
              className={classNames({
                'input is-danger': error,
                'input ': !error,
              })}
              value={title}
              onChange={(e) => {
                if (title.length) {
                  setError(false);
                }

                setTitle(e.target.value);
              }}
            />
          </div>

          {error ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={fmBUtton}
            >
              Find a movie
            </button>
          </div>

          {movie ? (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToTheList}
              >
                Add to the list
              </button>
            </div>
          ) : null}
        </div>
      </form>

      {movie ? (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      ) : null}
    </>
  );
};
