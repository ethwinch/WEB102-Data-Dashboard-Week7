// import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

const WeatherDetails = ({data}) => {
    return(
        <>
        <h1>Details</h1>
        <div>
            <h1>{data.city_name}</h1>
            <h2>{data.temp}°C</h2>
            <p>Humidity: {data.rh}%</p>
            <p>Wind: {data.wind_spd} m/s</p>
            <p>Pressure: {data.pres} mb</p>
        </div>
        </>
    )
}

export default WeatherDetails