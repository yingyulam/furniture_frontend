import update from "immutability-helper";
import { useCallback, useState, useEffect } from "react";
import { DnDCard } from "./DnDCard.js";
import FavoritesDataService from "../services/favorites.js";

export const CardList = ({ user, list, isFavorite }) => {
	const [DnDCards, setDnDCards] = useState([]);

	useEffect(() => {
		setDnDCards(list);
	}, [list]);

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
				draggable={isFavorite}
			/>
		);
	}, []);

	useEffect(() => {
		if (DnDCards.length > 0 && isFavorite) {
			FavoritesDataService.updateFavorites({
				_id: user.googleId,
				favorites: DnDCards,
			});
		}
	}, [DnDCards, user, isFavorite]);

	return (
		<>
			<div> {DnDCards.map((dndCard, i) => renderCard(dndCard, i))}</div>
		</>
	);
};

export default CardList;
