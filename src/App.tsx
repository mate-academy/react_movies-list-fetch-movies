/* eslint-disable no-console */
import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  addMovieToList = (movie:Movie | undefined) => {
    if (movie === undefined) {
      return;
    }

    if (this.state.movies.find((e) => e.imdbID === movie.imdbID)) {
      return;
    }

    this.setState(prevState => (
      {
        movies: [...prevState.movies, movie],
      }
    ));
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovieToList={(movie) => {
            this.addMovieToList(movie);
          }}
          />
        </div>
      </div>
    );
  }
}
