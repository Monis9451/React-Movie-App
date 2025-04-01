import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search';
import Loader from './components/Loader';
import MovieCard from './components/MovieCard';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

const App = () => {
    const [searchValue, setSearchValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [moviesList, setMoviesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');

    useDebounce(
        () => {
            setDebounceSearch(searchValue);
        },
        600,
        [searchValue]
    );

    const fetchMovies = async (query = '') => {
        setLoading(true);
        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            console.log(data);
            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
            }
            setMoviesList(data.results || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setErrorMessage('Failed to fetch movies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(debounceSearch);
    }, [debounceSearch]);

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="../public/hero-img.png" alt="Hero Banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You'll Love Without the Hassle
                    </h1>
                    <Search searchValue={searchValue} setSearchValue={setSearchValue} />
                </header>
                <section className="all-movies">
                    <h1 className="mt-[40px]">All Movies</h1>
                    {loading ? (
                        <p className="text-white">
                            <Loader />
                        </p>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {moviesList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;