import { useEffect, useState } from "react";
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherForecast } from "../services/weatherAPI";

const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unit, setUnits] = useState<string | null>("F");

    const fetchWeatherByCity = async (city: any) => {
        setLoading(true);
        setError(null);
        try {
            const [weatherData, forcast] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city)
            ]);
            
            setCurrentWeather(weatherData);
            setForecast(forcast);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch weather data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByLocation = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await getCurrentWeatherByCoords(latitude, longitude);

                setCurrentWeather(weatherData);
                const forecastData = await getWeatherForecast(weatherData.name);
                setForecast(forecastData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch weather data.");
            } finally {
                setLoading(false);
            }
        },
        error => {
            setError(`${error.message}`);
            setLoading(false);
        }
    );
    };

    const toggleUnits = () => {
        setUnits(unit === "F" ? "C" : "F");
    }

    useEffect(() => {
        fetchWeatherByCity("New York");
    }, []);

    return {
        currentWeather,
        forecast,
        loading,
        error,
        unit,
        fetchWeatherByCity,
        fetchWeatherByLocation,
        toggleUnits
    };
    
};

export default useWeather;