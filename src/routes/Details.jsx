import { useParams, Link } from "react-router-dom";
import WeatherDetails from "../components/WeatherDetails";

import { useEffect, useState } from "react";


const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

const Details = () => {
    const {cityName} = useParams()
    const [data, setData] = useState([])
    
    useEffect(() => {
        const callAPI = async () => {
          const response = await fetch(`https://api.weatherbit.io/v2.0/current?&city=${encodeURIComponent(cityName)}&key=${API_KEY}`)
          const json = await response.json()
          setData(json.data[0])
        }
        callAPI().catch(console.error)
      }, [cityName]);


    return (
        <div className="details">
            <h1>{data?.city_name}</h1>
            {/* <WeatherDetails city={data} /> */}
            <div>
                <h2>{data.temp}°C</h2>
                {/* <h3>{data.weather.description}</h3> */}
                <p>Cloud Coverage: {data.clouds}%</p>
                <p>Wind Speed: {data.wind_spd}</p>
                <p>Dew Point: {data.dewpt}°C</p>
                <p>Precipitation: {data.precip}</p>
                <p>UV: {data.uv}</p>
                <p>Air Quality Index: {data.aqi}</p>

                {/* <p>Humidity: {data.rh}%</p>
                <p>Wind: {data.wind_spd} m/s</p>
                <p>Pressure: {data.pres} mb</p> */}
            </div>
        </div>
    )
}

export default Details;