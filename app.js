const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const convert = require('xml-js');
const cors = require('cors')

const app = express();
const PORT = 3050;

// Middleware para analizar los cuerpos de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// Leer el archivo JSON con datos de ciudades
const citiesData = [
  {
    "name": "Madrid",
    "lat": 40.416775,
    "lon": -3.70379,
    "country": "ES",
    "timezone": 3600
  },
  {
    "name": "Barcelona",
    "lat": 41.385063,
    "lon": 2.173404,
    "country": "ES",
    "timezone": 3600
  },
  {
    "name": "Valencia",
    "lat": 39.46975,
    "lon": -0.37739,
    "country": "ES",
    "timezone": 3600
  },
  {
    "name": "Seville",
    "lat": 37.38863,
    "lon": -5.98214,
    "country": "ES",
    "timezone": 3600
  },
  {
    "name": "Zaragoza",
    "lat": 41.648822,
    "lon": -0.889085,
    "country": "ES",
    "timezone": 3600
  },
  {
    "name": "Málaga",
    "lat": 36.721302,
    "lon": -4.421636,
    "country": "ES",
    "timezone": 3600
  },
  {
    "name": "Murcia",
    "lat": 37.98381,
    "lon": -1.12994,
    "country": "ES",
    "timezone": 3600
  }
]

const weatherDescriptions = [
  'clear sky',
  'few clouds',
  'scattered clouds',
  'broken clouds',
  'shower rain',
  'rain',
  'thunderstorm',
  'snow',
  'mist'
];

// Endpoint para obtener las coordenadas de una ciudad
app.get('/api/coordinates', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(404).json({ error: 'Query param q is required' });
  }
  const city = citiesData.find(city => city.name.toLowerCase() === q.toLowerCase());


  if (city) {
    const { lat, lon } = city;
    res.status(200).json([{ name: q, lat, lon }]);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

// Endpoint para obtener el pronóstico del tiempo
app.get('/api/weather', (req, res) => {
  const { lat, lon } = req.query;
  console.log('lat: ', lat, ' lon: ', lon)
  const city = citiesData.find(city => city.lat == lat && city.lon == lon);
  

  if (city) {
    const randomIndex = Math.floor(Math.random() * weatherDescriptions.length);
    const randomWeatherDescription = weatherDescriptions[randomIndex];
    const { name, country, timezone } = city;
    const temperature = Math.round(Math.random() * (40 - (-10)) + (-10));
    const feels_like = Math.round(Math.random() * (40 - (-10)) + (-10));
    const humidity = Math.round(Math.random() * (100 - 0) + 0);
    const pressure = Math.round(Math.random() * (1100 - 900) + 900);
    const windSpeed = Math.round(Math.random() * (20 - 0) + 0);
    const weatherCode = Math.round(Math.random() * (804 - 200) + 200);

    const weatherXML = {
      _declaration: { _attributes: { version: '1.0', encoding: 'utf-8' } },
      current: {
        city: { _attributes: { name, id: 0 }, country, timezone },
        temperature: { _attributes: { value: temperature, unit: 'Celsius' } },
        feels_like: { _attributes: { value: feels_like, unit: 'Celsius' } },
        humidity: { _attributes: { value: humidity, unit: '%' } },
        pressure: { _attributes: { value: pressure, unit: 'hPa' } },
        wind: { speed: { _attributes: { value: windSpeed, unit: 'm/s' } } },
        weather: { _attributes: { number: weatherCode, value: randomWeatherDescription } },
        lastupdate: { _attributes: { value: new Date().toISOString() } }
      }
    };

    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const xmlData = convert.json2xml(weatherXML, options);

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xmlData);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
