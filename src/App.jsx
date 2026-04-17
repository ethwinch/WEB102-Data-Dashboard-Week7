import { useEffect, useState } from 'react'
import './App.css'

import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { LineChart, Line } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
//import { createBrowserRouter, createRoutesFromElements } from "react-router";
// import Header from './routes/Header.jsx';
// import Details from './routes/Details.jsx';



const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//     <Route path="/" element={<Header />}>
//       <Route index element={<App />}/>
//       <Route path="city/:cityName" element={<Details />}/>
//     </Route>
//     <Route path="*" element={<NotFound />}/>
//     </>
//   )
// )


function App() {
  const [city, setCity] = useState('New_York')
  const [weather, setWeather] = useState([])

  const [search, setSearch] = useState("")
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState("")


  useEffect(() => {
    const callAPI = async () => {
      const response = await fetch(`https://api.weatherbit.io/v2.0/current?&city=${city}&key=${API_KEY}`)
      const json = await response.json()
      setWeather(json.data)
      
      setHistory(prev => {
        const newCity = json.data

        // prevent duplicate cities
        if (prev.some(item => item.city_name === newCity.city_name)) {
          return prev;
        }

        return [...prev, newCity[0]]
      })
    }
    callAPI().catch(console.error)
  }, [city]);


  const handleSearch = () => {
    if (!search.trim()) return;
    setCity(search);
  };


  const sunsetCountdown = () => {
    const date = new Date();
    const hours = date.getUTCHours();
    const mins = date.getUTCMinutes();

    let total_current_mins = (hours * 60) + mins

    const sunset = current.sunset.split(":");
    let sunset_hours = parseInt(sunset[0]);
    let sunset_mins = parseInt(sunset[1]);

    let total_sunset_mins = (sunset_hours * 60) + sunset_mins


    let total_time_left = total_sunset_mins - total_current_mins

    let hours_left = total_time_left / 60
    let mins_left = total_time_left % 60

    if (hours_left < 0){
      return ("Sun has already set.")
    }else{
      return (`${hours_left.toFixed(0)} hrs ${mins_left.toFixed(0)} mins UTC`)
    }
  }

  const sunriseCountdown = () => {
    const date = new Date();
    const hours = date.getUTCHours();
    const mins = date.getUTCMinutes();

    let total_current_mins = (hours * 60) + mins

    const sunrise = current.sunrise.split(":");
    let sunrise_hours = parseInt(sunrise[0]);
    let sunrise_mins = parseInt(sunrise[1]);

    let total_sunrise_mins = (sunrise_hours * 60) + sunrise_mins


    let total_time_left = total_sunrise_mins - total_current_mins

    let hours_left = total_time_left / 60
    let mins_left = total_time_left % 60

    console.log(`Current Time: ${hours} hrs ${mins} mins UTC`)

    if (hours_left < 0){
      return ("Sun has already risen.")
    }else{
      return (`${hours_left.toFixed(0)} hrs ${mins_left.toFixed(0)} mins UTC`)
    }
  }

  const tempDiff = () => {
    const temp_diff = current.temp - current.app_temp

    if (temp_diff < 0){
      return (temp_diff * -1).toFixed(0)
    }else{
      return temp_diff.toFixed(0)
    }
  }

  const encode = (city_name) => {
    if (city_name.includes(" ")){
      return city_name.replace(" ", "_")
    }
  }

  const filterResults = (search) => {
    return history
      .filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      )
      .map((item, index) => (
        <li key={index} style={{paddingBottom: "1em"}}>
          <Link to={`/city/${encode(item.city_name)}`}>🧷</Link>
          <p><b>{item.city_name}</b> — {item.temp}°C</p>
          <p>Humidity: {item.rh}%</p>
          <p>Pressure: {item.pres} mb</p>
          <p>Wind: {item.wind_spd} m/s</p>
        </li>
      ));
  };

  

  function humidityBarChart() {
    return (
      <BarChart style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={history}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city_name" />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar dataKey="rh" fill="#82ca9d" name="Humidity (%)" />
        <RechartsDevtools />
      </BarChart>
    )
  }

  function tempLineChart() {
    return (
      <LineChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={history}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="city_name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temperature (°C)" />
      <RechartsDevtools />
    </LineChart>
    )
  }
  
  

  const current = weather?.[0]


  return(
    <>
    {/* <RouterProvider router={router} /> */}

    <h1>Weather by Location</h1>
        <h3>Enter City: </h3>
        <input type="text" id="city" name="city" value={search} onChange={(e) => setSearch(e.target.value)}></input>
        <button onClick={handleSearch}>Confirm</button>

        {current && current.sunset && current.sunrise && (
          <div className="summary-cards">
            <div className="card">
              <h2>Time Until Sunset</h2>
              <h3>{sunsetCountdown()}</h3>
            </div>
            <div className="card">
              <h2>Time Until Sunrise</h2> 
              <h3>{sunriseCountdown()}</h3>
            </div>
            <div className="card">
              <h2>Real Feel & Temp Difference</h2> 
              <h3>{tempDiff()}</h3>
            </div>
          </div>
        )}

        {current && (
          <div className="weather-card">
            <h2>{current.city_name}, {current.state_code}, {current.country_code}</h2>
            <h3>{current.lat}, {current.lon}</h3>
            <h3>Time Zone - {current.timezone}</h3>

            <h3>Nearest Reporting Station ID: {current.station}</h3>

            <p>🌅 Sunrise at {current.sunrise} UTC</p>
            <p>🌇 Sunset at {current.sunset} UTC</p>

            <h1>{current.temp} °C</h1>
            <h2>Feels Like {current.app_temp} °C</h2>

            <div>{humidityBarChart()}</div>
            <div>{tempLineChart()}</div>

            <br />

            <h3>Search City:</h3>
            <input type="text" id="search" name="search" placeholder="Search city..." value={filter} onChange={(e) =>setFilter(e.target.value)}></input>

            <br />

            <div className="filter-results">
              <ul>
                {filterResults(filter)}
              </ul>
            </div>
          </div>
        )}
    </>
  )
}

export default App
