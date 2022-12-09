import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);

  const changeQuery = (text: string) => {
    setError(false);
    setQuery(text);
  };

  function instanceOfMovie(data: MovieData | ResponseError):
    data is MovieData {
    return 'imdbID' in data;
  }

  const getMovieFromServer = async (text: string) => {
    setLoader(true);

    try {
      const isMovie = await getMovie(text);

      if (instanceOfMovie(isMovie)) {
        setMovie({
          title: isMovie.Title,
          description: isMovie.Plot,
          imgUrl: isMovie.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : isMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${isMovie.imdbID}`,
          imdbId: isMovie.imdbID,
        });
      } else {
        setError(true);
      }
    } finally {
      setLoader(false);
    }
  };

  const submitForm = (
    event: React.FormEvent<HTMLFormElement>,
    text: string,
  ) => {
    event.preventDefault();

    getMovieFromServer(text);
  };

  const addMovie = (movieToAdd: Movie) => {
    if (!movies.find(mov => mov.imdbId === movieToAdd.imdbId)) {
      setMovies(prevMovies => [...prevMovies, movieToAdd]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          onChangeQuery={changeQuery}
          movie={movie}
          error={error}
          onSubmit={submitForm}
          onAddMovie={addMovie}
          isLoader={loader}
        />
      </div>
    </div>
  );
};
