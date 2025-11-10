import { MapPin, Search, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { searchCities } from '../services/weatherAPI';

function SearchBar({ loading, onSearch, onLocationSearch }) {

    const [query, setQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<City[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [searchLoading, setsearchLoading] = React.useState(false);
    const [clickedSuggestion, setClickedSuggestion] = React.useState(false);


    interface City {
        name: string;
        state?: string;
        country: string;
        lat: number;
        lon: number;
    }

    const searchRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const searchTimeOut = setTimeout(async () => {
            if (!clickedSuggestion && query.length > 2) {
                setsearchLoading(true);

                try {
                    console.log("Fetching city suggestions for query:", query);
                    const result = await searchCities(query);
                    setSuggestions(result);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching city suggestions:", error);
                } finally {
                    setsearchLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(searchTimeOut);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setQuery("");
            setShowSuggestions(false);
        }
        setClickedSuggestion(false)
        console.log(query);
    }

    const clearSearch = () => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    }

    const handleSuggestionsClick = (city: any) => {
        const cityName = city.name ? `${city.name}, ${city.state}` : city.name;
        onSearch(cityName);
        setQuery(cityName);
        setClickedSuggestion(true);
        setShowSuggestions(false);
    }

    return (
        <div className="relative w-full max-w-2xl">
            <form className="relative" onSubmit={handleSubmit}>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grey/60 w-5 h-5 group-focus-within:text-white transition-all" />
                    <input type="text" value={query} onChange={(e) => { setQuery(e.target.value), setClickedSuggestion(false)}} placeholder="Search for a city" className="w-full pl-12 pr-24 py-4 bg-white/10 backdrop-blur-xl border border=white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 hover:bg-white/15" />
                    {/* conditional rendering */}
                    {query && (<button onClick={clearSearch} className="absolute right-14 top-1/3 transform -translate=y-1/2 text-white/50 hover:text-white transition-all p-1 rounded-full hover:bg-white/10">
                        <X className="w-4 h-4" />
                    </button>
                    )}
                    <button onClick={onLocationSearch} disabled={loading} className="absolute right-4 top-1/4 transform -translate=y-1/2 text-white/50 hover:text-white transition-all p-1 rounded-full hover:bg-white/10">
                        <MapPin className="w-5- h-5" />
                    </button>
                </div>
            </form>
            {/* conditional rendering */}
            {showSuggestions && (suggestions.length > 0 || searchLoading) && (<div className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                {/* conditional rendering */}
                {searchLoading ? (
                    <div className="p-6 text-center text-white/70">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mx-auto"></div>
                        <p>Searching Cities...</p>
                    </div>
                ) : (
                    suggestions.map((city, index) => {
                        return (
                            <button onClick={() => handleSuggestionsClick(city)} key={`${city.name}-${city.country}-${index}`} className="w-full px-6 py-4 text-left hover:bg-white/10 transition-all duration-200 flex items-center justify-between group border-b border-white/10 last:border-b-0">
                                <div>
                                    <div className="font-medium text-white group-hover:text-white/90">
                                        {city.name}
                                        {city.state && <span className="text-white/70">, {city.state}</span>}
                                    </div>
                                    <div className="text-sm text-white/60">{city.country}</div>
                                </div>
                                <Search className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-all" />
                            </button>
                        );
                    })
                )}
            </div>
            )}
        </div>
    )
}

export default SearchBar