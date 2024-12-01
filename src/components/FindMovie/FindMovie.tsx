import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');

  const [movie, setMovie] = useState<Movie>({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });

  const [loader, setLoader] = useState(false);
  const [errorFind, setErrorFind] = useState(false);

  const handleClick = () => {
    onAdd(movie);

    setMovie({
      title: '',
      description: '',
      imgUrl: '',
      imdbUrl: '',
      imdbId: '',
    });

    setQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorFind(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoader(true);

    getMovie(query)
      .then(res => {
        if ('Title' in res) {
          setMovie({
            title: res.Title,
            description: res.Plot,
            imgUrl:
              res.Poster !== 'N/A'
                ? res.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          });
        } else {
          setErrorFind(true);
        }
      })
      .finally(() => setLoader(false));
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
              className={cn('input', {
                'is-danger': errorFind,
              })}
              // "input is-danger"
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorFind && (
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
              className={cn('button', 'is-light', {
                'is-loading': loader,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie.title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
