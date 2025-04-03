import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search';
import Loader from './components/Loader';
import MovieCard from './components/MovieCard';
import {updateSearchCount} from './appwrite';
import { getTrendingMovies } from './appwrite';

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
    const [trendingMovies, setTrendingMovies] = useState([]);

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
            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
            }
            setMoviesList(data.results || []);
            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            setErrorMessage('Failed to fetch movies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
        }
    }

    useEffect(() => {
        fetchMovies(debounceSearch);
    }, [debounceSearch]);

    useEffect(() => {
        fetchTrendingMovies();
    },[])

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
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.searchValue} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                <section className="all-movies">
                    <h2>All Movies</h2>
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