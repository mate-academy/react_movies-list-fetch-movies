import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
// import { ResponseError } from '../../types/ReponseError';
import classNames from 'classnames';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  setSelectedMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ setSelectedMovie }) => {
  // disabled={this.id <= 9 ? true : false}
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (title) {
      setLoading(true);
      getMovie(title).then(response => {
        if (response) {
          const data = response as MovieData;
          const er = response as ResponseError;

          if (!er.Error) {
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : data.Poster,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
          } else {
            setError(true);
          }

        setLoading(false);
      }
    });
  }
  };

  const handleClickOnAddButton = () => {
    if (movie !== null) {
      setSelectedMovie(movie);
    }

    setTitle('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames("input", {"is-danger": error})}
              onChange={handleTitleChange}
            />
          </div>

          {error &&
          <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
          </p>
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames("button is-light",{"is-loading": loading})}
              disabled={title === ''}
            >
              Find a movie
            </button>
          </div>

        {
          movie !== null &&

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleClickOnAddButton}
            >
              Add to the list
            </button>
          </div>
          }
        </div>
      </form>



      {movie !== null && (
      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>
      )
      }

    </>
  );
};
