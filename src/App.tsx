import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<null | Movie>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [findButtonDisabled, setFindButtonDisabled] = useState(true);
  const [addButtonActive, setAddButtonActive] = useState(false);

  const defaultImg =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const normalizeResponse = response => {
    return {
      title: response.Title,
      imgUrl: response.Poster === 'N/A' ? defaultImg : response.Poster,
      description: response.Plot,
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
    };
  };

  const addMovie = () => {
    const isPresent = movies.some(m => m.imdbId === movie.imdbId);

    if (movie && !isPresent) {
      setMovies([...movies, movie]);
      setQuery('');
      setMovie(null);
      setAddButtonActive(false)
    }
  };

  const onSearch = event => {
    event.preventDefault();
    const normalizedQuery = query.trim().toLowerCase();

    getMovie(normalizedQuery).then(res => {
      if (res.Response === 'True') {
        setMovie(normalizeResponse(res));
        setErrorMessage('');
         setAddButtonActive(true);
      } else {
        setErrorMessage('Error');
      }
    });
  };

  // getMovie('D').then(res => console.log(res.Poster));
  // console.log(getMovie('D').then());

  const queryHandler = event => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setFindButtonDisabled(true);
    } else {
      setFindButtonDisabled(false);
  }
};

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSearch={onSearch}
          queryHandler={queryHandler}
          movie={movie}
          addMovie={addMovie}
          findButtonIsDisabled={findButtonDisabled}
          addButtonIsActive={addButtonActive}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};
