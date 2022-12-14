import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import './FindMovie.scss';

export type Props = {
  onAdd(movie: Movie): void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>();
  const [loader, setLoader] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleChangeMovieTitle = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setMovieTitle(ev.target.value);
      setHasError(false);
    }, [],
  );

  async function findMovie(search: string) {
    setLoader(true);

    const movieData = await getMovie(search.toLowerCase().trim());

    setLoader(false);

    if ('Error' in movieData) {
      setHasError(true);
    } else {
      const imgUrlNormalized = (movieData.Poster === 'N/A')
        ? ('https://via.placeholder.com/360x270.png?text=no%20preview')
        : (movieData.Poster);

      const newMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: imgUrlNormalized,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setMovie(newMovie);

      setHasError(false);
    }
  }

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    findMovie(movieTitle);
  };

  const handleAdd = useCallback(() => {
    if (movie) {
      onAdd(movie);
      setMovieTitle('');
      setMovie(null);
      setHasError(false);
    }
  }, [movie]);

  return (
    <>
      <form className="find-movie" onSubmit={(ev) => handleSubmit(ev)}>
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
              value={movieTitle}
              onChange={handleChangeMovieTitle}
            />
          </div>

          {hasError && (
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
              disabled={!movieTitle}
              className={
                classNames('button is-light', { 'is-loading finally': loader })
              }
            >
              {!movieTitle ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
