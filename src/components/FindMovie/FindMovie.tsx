import { useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';

type Props = {
  film: MovieData | null;
  setFilm: React.Dispatch<React.SetStateAction<MovieData | null>>;
  setList: React.Dispatch<React.SetStateAction<MovieData[]>>;
  list: MovieData[];
};

export const FindMovie: React.FC<Props> = (
  {
    setFilm,
    film,
    setList,
    list,
  },
) => {
  const [search, setSearch] = useState<string>('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    if (search === '') {
      return;
    }

    getMovie(search)
      .then(res => {
        if (res?.Title === undefined) {
          setError(true);
        } else {
          setFilm(res);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
              onChange={(e) => {
                setError(false);
                setSearch(e.target.value);
              }}
              value={search}
            />
          </div>
          {
            error
            && (
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
              className={`button ${search === '' && 'is-light'} ${loading && 'is-loading'}`}
              disabled={search === ''}
            >
              Find a movie
            </button>
          </div>
          {
            film !== null && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => {
                    if (!list.find(el => el.imdbID === film.imdbID)) {
                      setList((prev) => [...prev, film]);
                    }

                    setFilm(null);
                    setSearch('');
                  }}
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {
          film !== null && (
            <MovieCard film={film} />
          )
        }
      </div>
    </>
  );
};
