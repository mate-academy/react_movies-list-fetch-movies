import React, { useContext, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieContext } from '../MovieContext/MovieContextProvider';

export const FindMovie: React.FC = () => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [load, setLoad] = useState(false);
  const { setMovies, movies } = useContext(MovieContext);

  const clickEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoad(true);

    getMovie(title)
      .then(respose => {
        if (respose) {
          const res = respose as MovieData;

          if (res.Plot && res.imdbID) {
            setMovie({
              title: res.Title,
              imdbId: res.imdbID,
              imdbUrl: 'https://www.imdb.com/title/' + res.imdbID,
              imgUrl: res.Poster,
              description: res.Plot,
            });
          } else {
            setMovie({
              title: '',
              imdbId: '',
              imdbUrl: '',
              imgUrl: '',
              description: '',
            });
          }
        }
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const addToList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (movie) {
      if (!movies.find(x => x.imdbId === movie.imdbId)) {
        setMovies([...movies, movie]);
      }
    }

    setMovie(null);
    setTitle('');
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
              value={title}
              onChange={e => {
                if (movie && !movie.title) {
                  setMovie(null);
                }

                setTitle(e.target.value);
              }}
              className={classNames('input', {
                'is-danger': movie && !movie.title,
              })}
            />
          </div>

          {movie && !movie.title && (
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
                'is-loading': load,
              })}
              disabled={!title}
              onClick={e => clickEvent(e)}
            >
              {movie === null ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && movie.title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={e => addToList(e)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
