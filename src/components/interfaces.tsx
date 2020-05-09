export interface MoviesCard {
  title: string,
  description: string,
  imgUrl: string,
  imdbUrl: string,
  imdbId: string,
}

export interface FindMovState {
  searchValue: string,
  newMovie: MoviesCard | null,
  errorInput: boolean,
  isFinded: boolean,
}
