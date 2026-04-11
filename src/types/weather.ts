export interface WeatherRequest {
    location: string
}

export interface WeatherLocation {
    id: string
    name: string
    lat: string
    lon: string
    adm1: string
    adm2: string
}

export interface WeatherNow {
    obsTime: string
    temp: string
    feelsLike: string
    icon: string
    text: string
    wind360: string
    windDir: string
    windScale: string
    windSpeed: string
    humidity: string
    precip: string
    pressure: string
    vis: string
    cloud: string
    dew: string
}

export interface WeatherHourlyRaw {
    fxTime: string
    temp: string
    icon: string
    text: string
    wind360: string
    windDir: string
    windScale: string
    windSpeed: string
    humidity: string
    pop: string
    precip: string
    pressure: string
    cloud: string
    dew: string
}

export interface WeatherDailyRaw {
    fxDate: string
    sunrise: string
    sunset: string
    moonrise: string
    moonset: string
    moonPhase: string
    moonPhaseIcon: string
    tempMax: string
    tempMin: string
    iconDay: string
    textDay: string
    iconNight: string
    textNight: string
    wind360Day: string
    windDirDay: string
    windScaleDay: string
    windSpeedDay: string
    wind360Night: string
    windDirNight: string
    windScaleNight: string
    windSpeedNight: string
    humidity: string
    precip: string
    pressure: string
    vis: string
    cloud: string
    uvIndex: string
}

export interface WeatherAirIndex {
    code: string
    name: string
    aqi: number
    aqiDisplay: string
    level: string
    category: string
    primaryPollutant: string | null
}

export interface WeatherAir {
    indexes: WeatherAirIndex[]
}

export interface WeatherResponse {
    code: number
    msg: string
    data: {
        location: WeatherLocation
        now: WeatherNow
        hourly: WeatherHourlyRaw[]
        daily: WeatherDailyRaw[]
        air: WeatherAir
    }
}

export interface WeatherCurrentUI {
    temperature: number
    condition: string
    icon: string
    aqi: number
    aqiLevel: string
    location: string
    feelsLike: string
    windDir: string
    windScale: string
    windSpeed: string
    humidity: string
    pressure: string
    vis: string
}

export interface WeatherStatItem {
    label: string
    value: string
}

export interface HourlyForecastUI {
    time: string
    icon: string
    text: string
    temp: number
}

export interface DailyForecastUI {
    day: string
    iconDay: string
    textDay: string
    tempMin: number
    tempMax: number
    sunrise: string
    sunset: string
}

export interface LocationInfo {
    latitude: number
    longitude: number
    name: string
}
