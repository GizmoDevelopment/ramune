// Modules
import axios from "axios";

// Types
import { Show } from "@typings/types";

// Constants
const SHOW_ENDPOINT = import.meta.env.VITE_SHOW_ENDPOINT;

export async function getShows (): Promise<Show[]|[]> {
	try {
		return (await axios.get(`${ SHOW_ENDPOINT }/shows`)).data;
	} catch (err) {
		console.error(err);
		return [];
	}
}