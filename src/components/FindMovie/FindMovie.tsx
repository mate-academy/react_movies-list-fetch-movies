import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [notExistSuchTitle, setNotExistSuchTitle] = useState(false);

  // eslint-disable-next-line max-len
  const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const filteredMovie = await getMovie(query.trim());

      if ('Error' in filteredMovie) {
        throw new Error('There is not such film');
      } else {
        const {
          Poster, Title, Plot, imdbID,
        } = filteredMovie;

        const filmPoster = (Poster === 'N/A') ? defaultPicture : Poster;

        const preparedMovie = {
          title: Title,
          description: Plot,
          imgUrl: filmPoster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovieFromServer(preparedMovie);
      }
    } catch (error) {
      setNotExistSuchTitle(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setNotExistSuchTitle(false);
  };

  const handleAddClick = () => {
    onAddMovie(movieFromServer as Movie);
    setQuery('');
    setMovieFromServer(null);
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
              className="input is-dander"
              value={query}
              onChange={handleChangeInput}
            />
          </div>

          {notExistSuchTitle && (
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
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              disabled={(!query)}
            >
              {movieFromServer
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movieFromServer && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddClick}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movieFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFromServer} />
        </div>
      )}
    </>
  );
};
