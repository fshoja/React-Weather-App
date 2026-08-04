import React, { useEffect, useState } from 'react'
import './Weaterapp.css'
import { showDate } from '../../data';
import { BiSearch } from 'react-icons/bi';

export default function Weaterapp() {

  const [posts, setPostes] = useState({});
  const [city, setCity] = useState('iran');
  const [error, setError] = useState(false);



  
  const appData = {
  url: 'https://api.openweathermap.org/data/2.5/weather?q=',
  key: '45679eb97a3df93e1ff5a3b1bbb36538'
}
  


  useEffect(() => {

    fetch(`${appData.url}${city}&appid=${appData.key}&units=metric`)
      .then((res) => res.json())
      .then((data) => {

        console.log(data);

        if (data.cod === 404) {
          setError(true);
          return;
        }

        setError(false);
        setPostes(data);

      })
      .catch((err) => {
        console.log("API ERROR:", err);
        setError(true);
      });

  }, [city]);



  return (

    <div className="app-wrap">

      <main>

        <header>

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
                  {posts?.name} {posts?.sys?.country}
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

                  {posts?.weather?.[0]?.main}

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