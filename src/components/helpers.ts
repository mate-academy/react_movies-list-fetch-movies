export function checkIfStored(array: Movie[], element: Movie) {
  const index = array.findIndex(item => item.imdbID === element.imdbID);

  if (index === -1) {
    return false;
  }

  return true;
}
