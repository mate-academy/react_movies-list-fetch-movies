import { Movie } from '../types/Movie';

export const getNewMoveList = (newItem: Movie, array: Movie[]) => {
  const isItemInArr = array.some(item => item.imdbId === newItem.imdbId);

  return isItemInArr ? array : [...array, newItem];
};
