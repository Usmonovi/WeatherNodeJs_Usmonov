
var bodyParser = require('body-parser');
var express = require('express'); //подключаем библиотеку
var axios = require('axios');
var app = express();// сервак создаем
var path = require('path');

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

async function getWeather() {
  try {
    const response = await axios.get(`https://api.weather.yandex.ru/v1/forecast?lat=58&lon=65&lang=ru_RU`,
                                     {
        headers: {
            'X-Yandex-API-Key': '6bb65e8f-77e6-4275-8a25-b45b54de87e1',
            'Content-Type': 'application/json'
        }});
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

app.get('/', function (req, res) { // get запрос, который возвращает текст
  res.send('Hello World!');
});

app.get('/izzat', async function (req, res) {
    var check1;
    const weather = await getWeather(); //объект где содержится инфа о погоде
    const lat = weather['info']['lat']; //широта населеного пункта
    const lon = weather['info']['lon']; //Долгота населеного пункта
    const temp = weather['fact']['temp']; //Температура (°C).
    const feels_like = weather['fact']['feels_like']; //Ощущаемая температура (°C).
    const condition = weather['fact']['condition']; //Код расшифровки погодного описания. Возможные значения:(°C).
    const wind_speed = weather['fact']['wind_speed']; //Скорость ветра (в м/с).
    let moon_code = 'нет данных';
    if(weather['forecast'])
    {
        moon_code == weather['forecast']['moon_code'];
    }  
    
    let condition1 = '';
    
    if(condition == 'partly-cloudy' || 'cloudy' || 'clear')
        {
            condition1="ясно";
        }
    else {
        condition1="пасмурно";
    }
    
    let moon_code1 = 'нет данных';
    
    if (moon_code==0){moon_code1="полнолуние"}
    if (moon_code>0 && moon_code<4 ){moon_code1="убывающая Луна"}
    if (moon_code==4 ){moon_code1="последняя четверть Луны"}
    if (moon_code>4 && moon_code <8 ){moon_code1="убывающая Луна"}
    if (moon_code==8 ){moon_code1="новолуние"}
     if (moon_code>8 && moon_code<12 ){moon_code1="растущая Луна"}
        if (moon_code==12 ){moon_code1="первая четверть Луны"}
    if (moon_code>13 && moon_code <16 ){moon_code1="растущая Луна"}
    
    
    
    
    const data = { 
        title: 'laboratory',
        lat: lat,
        lon: lon,
        temp: temp,
        feels_like: feels_like,
        condition: condition1,
        wind_speed: wind_speed,
        moon_code: moon_code1,
    };
    res.render('index.html', data, function (err, html) {
        res.send(html)
    })
});

app.listen(3000, function () { 
  console.log('Example app listening on port 3000!');
});


