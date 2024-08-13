// eslint-disable-next-line no-unused-vars
import React from "react";
import Grid from '@mui/material/Grid';
import Divider  from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayers from './Prayers';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import {useState, useEffect} from "react"
import moment from "moment";
import "moment/dist/locale/ar"


moment.locale("ar")
export default function MainContent() {

    const [timings, setTimings] = useState({
        Fajr: '4',
        Dhuhr: '12',
        Asr: '4',
        Sunset: '6',
        Isha: '8',
    })
    
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0)

    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`)
        setTimings(response.data.data.timings)
    };
    
    const [dateAndTime, setDateAndTime] = useState("");

    const [selectedCity, setSelectedCity] = useState({
        displayName: 'المدينة المنورة',
        apiName:'Madinah'
    })

    useEffect(() => {
        getTimings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity]);

    useEffect(() => {
        let interval = setInterval(() => {
           setUpCountdownTimer();

            const today = moment();
            setDateAndTime(today.format("MMM Do YYYY | hh:mm"))
        }, 1000)

        return () => clearInterval(interval)
    },[timings])

    const prayerArray = [
        {key: "Fajr", displayName: "الفجر" },
        {key: "Dhuhr", displayName: "الظهر" },
        {key: "Asr", displayName: "العصر" },
        {key: "Sunset", displayName: "المغرب" },
        {key: "Isha", displayName: "العشاء" }
    ]
    
    const [remainingTime, setRemainingTime] = useState("0")

    const setUpCountdownTimer = () => {
        const timeNow = moment() 
        let PrayerIndex = null;
        if (timeNow.isAfter(moment(timings["Fajr"], "hh:mm")) && timeNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
            PrayerIndex = 1
        }else if (timeNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && timeNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
            PrayerIndex = 2
        }else if (timeNow.isAfter(moment(timings["Asr"], "hh:mm")) && timeNow.isBefore(moment(timings["Sunset"], "hh:mm"))) {
            PrayerIndex = 3
        }else if (timeNow.isAfter(moment(timings["Sunset"], "hh:mm")) && timeNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
            PrayerIndex = 4
        }else {
            PrayerIndex = 0
        }

        setNextPrayerIndex(PrayerIndex)

        const nextPrayerObject = prayerArray[PrayerIndex]
        const nextPrayerTime = timings[nextPrayerObject.key]
        const nextPrayerMoment = moment(nextPrayerTime, "hh:mm")

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(timeNow);
        

        if (remainingTime < 0 ){
            const midnight = moment("23:59:59", "hh:mm:ss").diff(timeNow);
            const midnightToFajr = nextPrayerMoment.diff(moment("00:00:00", "hh:mm:ss"))
            const totalDiff = midnight + midnightToFajr
            remainingTime = totalDiff
        }
        
        const durationRemainingTime = moment.duration(remainingTime)
        
        setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`)
    }

    function handleCityChange(event){
        const cityObject = availablecities.find((city) => {
            return city.apiName == event.target.value
        })
        setSelectedCity(cityObject)
    }

    const availablecities = [
        {
            displayName: "المدينة المنورة",
            apiName: 'Madinah'
        },
        {
            displayName:"مكة المكرمة",
            apiName: 'Makkah al Mukarramah'
        },
        {
            displayName: "الرياض ",
            apiName: 'Riyadh'
        }
    ]
    
    return ( 
    <>
       {/* top row */}
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid xs={6} >
                <h2>
                    {dateAndTime}
                </h2>

                <h1>{selectedCity.displayName}</h1>
            </Grid>

            <Grid xs={6}>
                <h2>الوقت المتبقي حتى الصلاة {prayerArray[nextPrayerIndex].displayName}</h2>
                <h1>{remainingTime}
                </h1>
            </Grid>
        </Grid>
        {/*== top row ==*/}

        <Divider style={{ borderColor: 'white', opacity:"0.1"}} />
        
        {/* prayers cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={'space-around'} marginTop={4} spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Prayers prayerName="الفجر" time={timings.Fajr}/>
            <Prayers prayerName="الظهر"  time={timings.Dhuhr}/>
            <Prayers prayerName="العصر" time={timings.Asr}/>
            <Prayers prayerName="المغرب" time={timings.Sunset}/>
            <Prayers prayerName="العشاء" time={timings.Isha}/>
        </Stack>
        {/*== prayers crads ==*/}

        {/* select city */}
        <Stack direction={'row'} justifyContent={'center'} style={{marginTop: '30px'}}>
        <FormControl style={{width: "20%", borderColor:"white"}} >
            <InputLabel id="demo-simple-select-label"> 
                <span style={{color: 'white'}}> المدينة</span>
            </InputLabel>
            <Select
            style={{color: 'white'}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
            >
                {availablecities.map((city) => {
                    return (<MenuItem key={city.displayName} value={city.apiName} >
                                {city.displayName} 
                            </MenuItem>);
                    })}
            </Select>
        </FormControl>  
        </Stack>
        {/*== select city ==*/}
    </>
    )
}