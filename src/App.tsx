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

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={(movie) => {
            const movieInList = this.state.movies
              .find(movieList => movieList.imdbID === movie.imdbID);

            if (!movieInList) {
              this.setState(state => ({
                movies: [...state.movies, movie],
              }));
            }
          }}
          />
        </div>
      </div>
    );
  }
}
