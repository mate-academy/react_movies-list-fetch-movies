export const getMovie = (title: string) => {
  return fetch(`http://www.omdbapi.com/?apikey=83c3ed73&t=${title}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};
