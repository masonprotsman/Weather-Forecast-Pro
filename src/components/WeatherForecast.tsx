import { Calendar, Droplets } from "lucide-react";
import { formatDate, formatTemperature, getWeatherIcon } from "../utils/weatherutils";
import * as LucideIcons from 'lucide-react';

// Add interface for forecast data
interface ForecastItem {
    dt: number;
    pop: number;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
}

interface DailyForecast {
    [date: string]: ForecastItem;
}

// Update function signature with types
function WeatherForecast({ forecast, unit }: { forecast: { list: ForecastItem[] }; unit: string | null }) {
    const dailyForecast: DailyForecast = forecast.list.reduce((acc: DailyForecast, item: ForecastItem) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!acc[date]) {
            acc[date] = item;
        }
        return acc;
    }, {} as DailyForecast); // Add initial value for reduce

    const dailyItems = Object.values(dailyForecast).slice(0, 5);

    // Now use dailyForecast to render the component
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-white/10 rounded-full">
                    <Calendar className="w-6 h-6 text-white/80" />
                </div>
                <h2 className="text-2xl font-bold text-white">5-Day Forecast</h2>
            </div>
            <div className="space-y-4">
                {dailyItems.map((item, index) => {
                    const iconName = getWeatherIcon(item.weather[0]) as keyof typeof LucideIcons;
                    const IconComponent = (LucideIcons[iconName] ?? LucideIcons.Cloud) as React.ComponentType<any>;
                    return (
                        <div key={index} className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 group border border-white/10">
                            <div className="flex items-center space-x-5 flex-1">
                                <div className="text-white/90 group-hover:text-white transition-all transform group-hover:scale-110 duration">
                                    {/* dynamic icons */}
                                    <IconComponent size={40} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold text-lg">
                                        {/* conditional date */}
                                        {index === 0 ? "Today" : formatDate(item.dt)}
                                    </div>
                                    <div className="text-white/70 text-sm capitalize font-medium">
                                        {item.weather[0].description}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-white/60">
                                    <Droplets className="w-4 h-4 text-blue-300" />
                                    <span className="text-sm font-medium">
                                        {/* dynamic details */}
                                        {Math.round(item?.pop * 100)}%
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold text-xl">
                                        {formatTemperature(item.main.temp_max, unit)}°{unit}
                                    </div>
                                    <div className="text-white text-sm font-medium">
                                        {formatTemperature(item.main.temp_min, unit)}°{unit}
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default WeatherForecast;