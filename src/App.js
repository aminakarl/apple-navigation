import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import "./App.scss";
import _ from "lodash";
import loadingGif from './assets/loading.gif'
const navigation = require("./navigation.json");

export default function App() {
  const [selectedCity, setSelectedCity] = useState(
    navigation.cities[0].section
  );
  const [underlineWidth, setUnderlineWidth] = useState("0px");
  const [underlinePosition, setUnderlinePosition] = useState("0px");
  const [animationTransition, setAnimationTransition] = useState(false);
  const [time, setTime] = useState(null);
  const [timezoneLocation, setTimezoneLocation] = useState(navigation.cities[0].timezoneLocation);

  const handleNewCitySelection = (event, newSelectedCity) => {
    if (!animationTransition) {
      setAnimationTransition(true);
    }
    const targetPosition = event.target.getBoundingClientRect();
    setSelectedCity(newSelectedCity.section);
	console.log("setTimezoneLocation", newSelectedCity.timezoneLocation);
	setTimezoneLocation(newSelectedCity.timezoneLocation);
    setUnderlineWidth(targetPosition.width);
    setUnderlinePosition(targetPosition.x);
  };

  const updateUnderline = () => {
    const selectedCityElementPosition = document
      .getElementById(selectedCity)
      .getBoundingClientRect();
    setUnderlineWidth(selectedCityElementPosition.width);
    setUnderlinePosition(selectedCityElementPosition.x);
  };

  const updateLocalTime = () => {
	setTime(null);
	fetch(`http://worldtimeapi.org/api/timezone/${timezoneLocation}`)
	.then((res) => res.json())
	.then((json) => {
	  const longVersionTime = json.datetime.split("T")[1];
	  const time = longVersionTime.split(".")[0];
	  let hour = Number(time.slice(0, 2));
	  let minutes = Number(time.slice(3, 5));
	  let ampm = "";

	  if(hour === 0) {
		  hour = 12;
		  ampm = "AM";
	  } else if(hour === 12) {
		  ampm = "PM";
	  } else if(hour > 12) {
		  hour -= 12;
		  ampm = "PM";
	  } else {
		  ampm = "AM";
	  }
	  const formattedTime = `${hour}:${minutes} ${ampm}`;
	  setTime(formattedTime);
	});
  };

  useEffect(() => {
    updateUnderline();
    updateLocalTime();
  }, []);

  useEffect(() => {
    const handleWindowResize = debounce(() => {
      updateUnderline();
    }, 500);
    window.addEventListener("resize", handleWindowResize);

    return (_) => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  useEffect(() => {
	updateLocalTime();
  }, [timezoneLocation]);

  return (
	<>
		<section className="navigation">
			<nav>
				<ul>
				{navigation.cities.map((city) => (
					<li
						className={`${
							selectedCity === city.section ? "selectedCity" : ""
						}`}
						id={city.section}
						key={city.section}
						onClick={(event) => handleNewCitySelection(event, city)}
					>
						{city.label}
					</li>
				))}
				</ul>
			</nav>
			<div
				className={`underline${animationTransition ? " transition" : ""}`}
				style={{ width: underlineWidth, left: underlinePosition }}
			></div>
		</section>
		<section className="time">
			{time ? 
				<p>{time}</p> : 
				<img className="loadingGif" src={loadingGif} alt="Loading..." />
			}
		</section>
	</>
  );
}
