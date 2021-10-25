export const getMovie = (title: string) => {
  return fetch(`http://www.omdbapi.com/?apikey=83c3ed73&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
