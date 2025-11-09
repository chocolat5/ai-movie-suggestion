import { Movie } from "../types/types";
import { getGenreNames } from "./genres";

const baseURL = "https://api.themoviedb.org/3";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

export async function searchMovies(
  query: string,
  token: string,
  year?: number
): Promise<Movie[]> {
  const yearParam = year ? `&primary_release_year=${year}` : ``;
  const url = `${baseURL}/search/movie?include_adult=false&language=en-US&page=1&query=${query}${yearParam}`;

  let response = [];
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Internal Error");
    }

    const json = await res.json();
    const temData = json.results;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = temData.map((r: any) => ({
      id: r.id,
      title: r.title,
      year: r.release_date ? new Date(r.release_date).getFullYear() : 0,
      posterPath: r.poster_path,
      genres: getGenreNames(r.genre_ids),
    }));
  } catch (err) {
    console.error(err);
  }

  return response;
}
