import React, { useState } from 'react';
import './FindMovie.scss';
import { Input } from './Input';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './Button';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
  };

  const onClickFindButton = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    getMovie(query)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          throw new Error((data as ResponseError).Error);
        }

        const { Poster, Title, Plot, imdbID } = data as MovieData;
        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: `${Poster === 'N/A' ? 'https://via.placeholder.com/360x270.png?text=no%20preview' : Poster}`,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(newMovie);
      })
      .catch(error => {
        setErrorMessage(
          error.message === 'Movie not found!'
            ? "Can't find a movie with such a title"
            : error.message,
        );
      })
      .finally(() => setIsLoading(false));
  };

  const onClickAddMovie = (mov: Movie) => {
    onAddMovie(mov);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={onClickFindButton}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <Input
              value={query}
              onChange={onChange}
              errorMessage={errorMessage}
            />
          </div>

          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <Button
              data="searchButton"
              type="submit"
              className="button is-light"
              content="Find a movie"
              isLoading={isLoading}
              isDidabled={!query}
            />
          </div>

          {movie && (
            <div className="control">
              <Button
                data="addButton"
                type="button"
                className="button is-primary"
                content="Add to the list"
                onClick={() => onClickAddMovie(movie)}
              />
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
