import React, { useEffect, useState } from 'react'
import './Weaterapp.css'
import { showDate } from '../../data'

export default function Weaterapp() {

  const [posts, setPosts] = useState({})
  const [city, setCity] = useState('iran')
  const [error, setError] = useState(false)

  useEffect(() => {

    async function getWeather() {
      try {

        // گرفتن مختصات شهر
        const geo = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        )

        const geoData = await geo.json()

        if (!geoData.results) {
          setError(true)
          return
        }

        const { latitude, longitude, name, country } = geoData.results[0]


        // گرفتن آب و هوا
        const weather = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        )

        const weatherData = await weather.json()


        setPosts({
          name,
          country,
          main: {
            temp: weatherData.current.temperature_2m,
            temp_min: weatherData.daily.temperature_2m_min[0],
            temp_max: weatherData.daily.temperature_2m_max[0]
          },
          weather: [
            {
              main: weatherData.current.weather_code
            }
          ]
        })

        setError(false)

      } catch (err) {
        console.log("API ERROR:", err)
        setError(true)
      }

    }

    getWeather()

  }, [city])


  return (
    <div className="app-wrap">

      <main>

        <header>
          <input
            value={city}
            onChange={(e)=>setCity(e.target.value)}
            type="text"
            placeholder="Search for a city..."
          />
        </header>


        {
          error ? (

            <div className="not-found">
              <h2>City not found 😕</h2>
              <p>Please enter a valid city name.</p>
            </div>

          ) : (

            <>
              <section className="location">

                <div className="city">
                  {posts.name} {posts.country}
                </div>

                <div className="date">
                  {showDate()}
                </div>

              </section>


              <div className="current">

                <div className="temp">
                  {
                    posts?.main?.temp
                    ? Math.floor(posts.main.temp)
                    : '--'
                  }

                  <span>°C</span>
                </div>


                <div className="weather">
                  Weather
                </div>


                <div className="hi-low">
                  {
                    posts?.main
                    ?
                    `${Math.floor(posts.main.temp_min)}°C / ${Math.floor(posts.main.temp_max)}°C`
                    :
                    '--°C / --°C'
                  }
                </div>


              </div>
            </>

          )
        }

      </main>

    </div>
  )
}