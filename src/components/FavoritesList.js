import update from "immutability-helper";
import { useCallback, useState, useEffect } from "react";
import { DnDCard } from "./DnDCard.js";
import FavoritesDataService from "../services/favorites.js";

export const FavoritesList = ({ user, favorites }) => {
	const [DnDCards, setDnDCards] = useState([]);

	useEffect(() => {
		setDnDCards(favorites);
	}, [favorites]);

	const moveCard = useCallback((dragIndex, hoverIndex) => {
		setDnDCards((prevCards) =>
			update(prevCards, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, prevCards[dragIndex]],
				],
			})
		);
	}, []);

	const renderCard = useCallback((dndCard, index) => {
		//console.log(`Card is ${dndCard}` + `index is ${index}`);
		return (
			<DnDCard
				key={dndCard}
				index={index}
				id={dndCard}
				text={dndCard}
				moveCard={moveCard}
			/>
		);
	}, []);

	useEffect(() => {
		if (DnDCards.length > 0) {
			FavoritesDataService.updateFavorites({
				_id: user.googleId,
				favorites: DnDCards,
			});
		}
	}, [DnDCards, user]);

	return (
		<>
			<div> {DnDCards.map((dndCard, i) => renderCard(dndCard, i))}</div>
		</>
	);
};

export default FavoritesList;
