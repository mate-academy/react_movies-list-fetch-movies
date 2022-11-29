import classNames from 'classnames';
import {
  ChangeEvent,
  FC,
  FormEvent,
  memo,
  useCallback,
  useState,
} from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type FindMovieProps = {
  addMovie: (movie:Movie) => void;
};

export const FindMovie: FC<FindMovieProps> = memo(({ addMovie }) => {
  const [film, setFilm] = useState<Movie | null>(null);
  const [searchFilm, setSearchFilm] = useState('');
  const [loading, setLoading] = useState(false);
  const [haveError, setHaveError] = useState(false);

  const handleFormSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    getMovie(searchFilm)
      .then(data => {
        if ('Error' in data) {
          return setHaveError(true);
        }

        return setFilm(
          {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          },
        );
      })
      .finally(() => setLoading(false));
  }, [searchFilm]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchFilm(event.target.value);
    setHaveError(false);
  }, [searchFilm, haveError]);

  const addFilmToList = useCallback(() => {
    if (film) {
      addMovie(film);
    }

    setFilm(null);
    setSearchFilm('');
  }, [film, addMovie]);

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              value={searchFilm}
              onChange={handleSearch}
            />
          </div>

          {haveError && (
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
              className={classNames('button is -light', {
                'is-loading': loading,
              })}
              disabled={!searchFilm}
            >
              {film ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {film && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addFilmToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {film && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={film} />
        </div>
      )}
    </>
  );
});
