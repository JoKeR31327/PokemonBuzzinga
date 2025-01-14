import React, { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { Link, useParams } from "react-router-dom";
import TeamCard from "../my-teams/TeamCard";
import MyPokemonEntry from "../pokemons/MyPokemonEntry";

const InfoList = ({ children }) => {
	return <div className="ml-4 grid grid-cols-[max-content_max-content_auto] gap-x-1 gap-y-0.5">{children}</div>;
};

const Info = ({ title, value }) => {
	return (
		<>
			<span className="pr-4">{title}</span>
			<span className="pr-8">:</span>
			<span>{value}</span>
		</>
	);
};

const Profile = () => {
	const { user } = useAuthContext();
	const { trainer_id } = useParams();

	const [profileData, setProfileData] = useState();
	const [pokemonData, setPokemonData] = useState();

	const getProfileData = async () => {
		try {
			const req = await axios.get(`/trainer/${trainer_id}`);
			const data = await req.data;

			setProfileData(data);
		} catch (error) {
			console.error(error);
		}
	};

	const getStrongestPokemonData = async () => {
		try {
			const req = await axios.get(`/owned-pokemon/${profileData.strongest_pokemon_id}`);
			const myPokemonData = req.data;

			// console.log(myPokemonData);

			const reqPokemonData = await axios.get(`/pokemons/${myPokemonData.pokemon_id}`);
			const pokemonData = reqPokemonData.data;

			setPokemonData({ ...myPokemonData, pokemonData: { ...pokemonData } });
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeselect = async () => {
		try {
			const req = await axios.put(`/trainer/${user.id}/battle-team`, { team_id: null });
			const data = req.data;

			getProfileData();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getProfileData();
	}, []);

	useEffect(() => {
		if (profileData && profileData.strongest_pokemon_id) {
			getStrongestPokemonData();
		}
	}, [profileData]);

	if (!profileData) {
		return null;
	}

	const battle_team = profileData.team_id
		? {
				team_id: profileData.team_id,
				trainer_id: profileData.trainer_id,
				team_name: profileData.team_name,
		  }
		: null;

	return (
		<>
			<div className="min-w-[800px] mt-8">
				<h1 className="text-h1 mb-20">Profile</h1>
				<div className="grid grid-cols-[auto_max-content] justify-between gap-y-20">
					<div className="mb-10">
						<h3 className="text-h3 mb-6">Trainer Info</h3>
						<InfoList>
							<Info title="Name" value={profileData.name} />
							<Info title="Region" value={profileData.region_name} />
							<Info title="Balance" value={profileData.balance} />
							<Info title="Pokemons Collected" value={profileData.pokemon_count} />
							<Info title="Teams Created" value={profileData.team_count} />
						</InfoList>
					</div>
					<div>
						<h3 className="text-h3 mb-6">Statistics</h3>
						<InfoList>
							<Info title="Battles Fought" value={profileData.battle_count} />
							<Info title="Battles Won" value={profileData.battle_win_count} />
							<Info title="Tournaments Played" value={profileData.tournament_count} />
							<Info title="Tournaments Won" value={profileData.tournament_win_count} />
						</InfoList>
					</div>
					<div>
						<h3 className="text-h3 mb-6">Strongest Pokemon</h3>
						<div className="ml-4 scale-[80%] origin-top-left">
							{!!pokemonData && <MyPokemonEntry {...pokemonData} inProfile={true} />}
						</div>
					</div>
					<div>
						<h3 className="text-h3 mb-6">Battle Team</h3>
						<div className="ml-4 flex flex-col gap-4 items-center">
							{!!battle_team ? <TeamCard {...battle_team} /> : <p>No Battle Team</p>}
							{user.id === profileData.id && !!battle_team ? (
								<>
									<button className={`${profileData.in_queue ? "btn--red" : "btn--green"} rounded-sm`}>
										{profileData.in_queue ? "Dequeue" : "Queue"}
									</button>
									<button className="btn" onClick={handleDeselect}>
										Deselect Battle Team
									</button>
								</>
							) : (
								<>
									<Link to="/my-teams/" className="btn">
										Select Battle Team
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
