export const getWeatherIcon = (weather: any) => {
    const iconMap: any = {
        "Clear": "Sun",
        "Clouds": "Cloud",
        "Rain": "CloudRain",
        "Drizzle": "CloudDrizzle",
        "Thunderstorm": "CloudLightning",
        "Snow": "CloudSnow",
        "Mist": "CloudFog",
        "Smoke": "CloudFog",
        "Haze": "CloudFog",
        "Dust": "Wind",
        "Fog": "Wind",
        "Sand": "Wind",
        "Ash": "Wind",
        "Squall": "Wind",
        "Tornado": "Tornado"
    };

    return iconMap[weather.main] || "Cloud";
};

export const formatTemperature = (temp: number, unit: string | null) => {
    if (unit === "C") {
        return `${Math.round(temp)}`;
    } else {
        return `${Math.round((temp * 9) / 5 + 32)}`;
    }
};

export const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export const getWindDirection = (degree: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(degree / 22.5) % 16];
}

