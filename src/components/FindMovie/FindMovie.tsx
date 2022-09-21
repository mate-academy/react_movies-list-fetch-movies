import React, { ChangeEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[];
  handleMovieSet: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, handleMovieSet }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const handleMovieSearch = () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setMovie(null);
        } else {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        }
      })
      .finally(() => {
        setIsFetching(false);
        setIsSearched(true);
      });
  };

  const handleMovieAdd = () => {
    if (!movie) {
      return;
    }

    const isMovieFound = movies.find(current => current.title === movie.title);

    if (!isMovieFound) {
      handleMovieSet(movie);
    }

    setMovie(null);
    setTitle('');
    setIsSearched(false);
  };

  const handleInput = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
    setIsSearched(false);
  };

  const handleSearch = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (!title) {
      return;
    }

    handleMovieSearch();
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    handleMovieAdd();
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
              className={`input ${!movie && isSearched ? 'is-danger' : ''}`}
              value={title}
              onChange={event => handleInput(event)}
            />
          </div>

          {!movie && isSearched && (
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
              className={`button is-light ${isFetching ? 'is-loading' : ''}`}
              disabled={(!movie && isSearched) || !title}
              onClick={event => handleSearch(event)}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={event => handleSubmit(event)}
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
