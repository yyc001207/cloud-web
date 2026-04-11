import { ref, readonly } from 'vue'
import { getWeather } from '../api/weather'
import type {
    WeatherCurrentUI,
    WeatherStatItem,
    HourlyForecastUI,
    DailyForecastUI,
    LocationInfo,
} from '../types/weather'

const DEFAULT_LOCATION = '深圳'

const currentWeather = ref<WeatherCurrentUI | null>(null)
const stats = ref<WeatherStatItem[]>([])
const hourlyForecast = ref<HourlyForecastUI[]>([])
const dailyForecast = ref<DailyForecastUI[]>([])
const locationInfo = ref<LocationInfo | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let initialized = false

function getLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('浏览器不支持地理定位'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        reject(new Error('无法获取位置信息，请允许定位权限'))
                        break
                    case err.POSITION_UNAVAILABLE:
                        reject(new Error('位置信息不可用'))
                        break
                    case err.TIMEOUT:
                        reject(new Error('获取位置信息超时'))
                        break
                    default:
                        reject(new Error('获取位置信息失败'))
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
            },
        )
    })
}

function formatFxTime(fxTime: string): string {
    const match = fxTime.match(/T(\d{2}):(\d{2})/)
    if (match) return `${match[1]}:${match[2]}`
    return fxTime
}

function formatFxDate(fxDate: string, index: number): string {
    if (index === 0) return '今天'
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const date = new Date(fxDate)
    return dayNames[date.getDay()]
}

async function fetchWeather(location: string) {
    const res = await getWeather({ location })
    const data = res.data
    const loc = data.location
    const now = data.now
    const air = data.air
    const hourly = data.hourly
    const daily = data.daily

    const locationName = `${loc.adm1}${loc.adm2}${loc.name}`
    const aqiIndex = air.indexes?.[0]

    currentWeather.value = {
        temperature: Number(now.temp),
        condition: now.text,
        icon: now.icon,
        aqi: aqiIndex?.aqi ?? 0,
        aqiLevel: aqiIndex?.category ?? '未知',
        location: locationName,
        feelsLike: now.feelsLike,
        windDir: now.windDir,
        windScale: now.windScale,
        windSpeed: now.windSpeed,
        humidity: now.humidity,
        pressure: now.pressure,
        vis: now.vis,
    }

    const today = daily[0]
    stats.value = [
        { label: '风速', value: `${now.windDir} ${now.windSpeed}m/s` },
        { label: '湿度', value: `${now.humidity}%` },
        { label: '气压', value: `${now.pressure} hPa` },
        { label: '降水量', value: `${now.precip}mm` },
        { label: '能见度', value: `${now.vis}km` },
        { label: '温度范围', value: `${today?.tempMin ?? '--'}° - ${today?.tempMax ?? '--'}°` },
        { label: '日出日落', value: `${today?.sunrise ?? '--'}  ${today?.sunset ?? '--'}` },
    ]

    hourlyForecast.value = hourly.map((h) => ({
        time: formatFxTime(h.fxTime),
        icon: h.icon,
        text: h.text,
        temp: Number(h.temp),
    }))

    dailyForecast.value = daily.map((d, i) => ({
        day: formatFxDate(d.fxDate, i),
        iconDay: d.iconDay,
        textDay: d.textDay,
        tempMin: Number(d.tempMin),
        tempMax: Number(d.tempMax),
        sunrise: d.sunrise,
        sunset: d.sunset,
    }))

    locationInfo.value = {
        latitude: Number(loc.lat),
        longitude: Number(loc.lon),
        name: locationName,
    }
}

async function init() {
    if (initialized) return
    initialized = true
    await refresh()
}

async function refresh() {
    loading.value = true
    error.value = null

    try {
        let location = DEFAULT_LOCATION

        try {
            const coords = await getLocation()
            location = `${coords.longitude},${coords.latitude}`
        } catch (locError) {
        }

        await fetchWeather(location)
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '获取天气数据失败，请稍后重试'
        error.value = message
    } finally {
        loading.value = false
    }
}

export function useWeather() {
    return {
        currentWeather,
        stats,
        hourlyForecast,
        dailyForecast,
        locationInfo,
        loading: readonly(loading),
        error: readonly(error),
        init,
        refresh,
    }
}
