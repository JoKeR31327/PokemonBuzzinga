import React, { useEffect, useState } from "react";
import axiosApi from "../../utils/AxiosSetup";
import { Link } from "react-router-dom";

function TeamCard({ team_id, trainer_id, team_name, refreshTeams }) {
	const [pokemons, setPokemons] = useState([]);

	const getTeamPokemons = async () => {
		try {
			const req = await axiosApi.get(`/teams/${team_id}/pokemons`);
			const data = req.data;

			setPokemons(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteTeam = async () => {
		const formData = {
			teamId: team_id,
		};

		try {
			const req = await axiosApi.delete(`/teams/${trainer_id}`, { data: formData });
			const data = req.data;
			console.log(data);

			refreshTeams();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTeamPokemons();
	}, []);

	return (
		<div className="flex flex-col items-center w-48 min-h-80 rounded-lg bg-slate-800 p-4">
			{/* <span>{id}</span> */}
			<span className="text-h3 my-2">{team_name}</span>
			{pokemons.map((pokemon) => (
				<div key={pokemon.id} className="flex w-full p-1 justify-start gap-4 text-left text-sm">
					<span>{pokemon.id} : </span>
					<span className="flex-auto">{pokemon.nickname} : </span>
					<span>{pokemon.total}</span>
				</div>
			))}
			<Link to={`/team/${team_id}`} className="btn text-center mt-auto">
				Details
			</Link>

			<button className="btn bg-red-900 mt-2" onClick={handleDeleteTeam}>
				Delete
			</button>
		</div>
	);
}

export default TeamCard;
