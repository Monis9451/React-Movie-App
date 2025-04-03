import React, {useState, useEffect} from 'react'
import Search from './components/search'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchValue, setSearchValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [moviesList, setMoviesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchMovies = async () => {
        setLoading(true);
        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            if(!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            console.log(data);
            if(data.Response === 'False') {
                setErrorMessage(data.Error ||  'Failed to fetch movies');
            }
            setMoviesList(data.results || []);
        }
        catch (error){
            console.error('Error fetching movies:', error);
            setErrorMessage('Failed to fetch movies. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMovies();
    }, [])
  return (
    <main>
        <div className='pattern'/>
            <div className='wrapper'>
                <header>
                    <img src="../public/hero-img.png" alt="Hero Banner" />
                    <h1>Find <span className='text-gradient'>Movies</span> You'll Love Without the Hassle</h1>
                    <Search searchValue={searchValue} setSearchValue={setSearchValue}/>
                </header>
                <section className='all-movies'>
                    <h1>All Movies</h1>
                    {loading?
                     <p className='text-white'>Loading...</p> : 
                     setErrorMessage? <p className='text-red-500'>{errorMessage}</p> :
                     (
                        <ul>
                            {moviesList.map((movie) => (
                                <p className='text-white'>{movie.original_title}</p>
                            ))}
                        </ul>
                     )}
                </section>
            </div>
    </main>
  )
}

export default App