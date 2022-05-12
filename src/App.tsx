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

  checkIsMovieInArray = (movieToCheck: Movie | null) => {
    if (movieToCheck) {
      if (this.state.movies
        .find(movie => movie.imdbID === movieToCheck.imdbID)) {
        return true;
      }
    }

    return false;
  };

  addMovie = (receivedMovie: Movie | null) => {
    if (receivedMovie && !this.checkIsMovieInArray(receivedMovie)) {
      this.setState(state => {
        return {
          movies: [...state.movies,
            receivedMovie],
        };
      });
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            addNewMovie={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
