import { useState, useEffect } from "react";
import { formatTime } from "./helpers/formatTime";
import debounce from "lodash/debounce";
import "./App.scss";
import loadingGif from './assets/loading.gif'
import navigation from "./navigation.json";

export default function App() {
	const [selectedCity, setSelectedCity] = useState(navigation.cities[0].section);
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
		fetch(`http://worldtimeapi.org/api/timezone/${timezoneLocation}/`)
			.then((res) => res.json())
			.then((json) => {
				const time = json.datetime.split("T")[1].split(".")[0];
				const [hour, minutes] = time.split(":");
				const formattedTime = formatTime(hour, minutes);
				setTime(formattedTime);
			})
			.catch((error) => console.error("Error fetching time:", error));
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

		return () => {
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
