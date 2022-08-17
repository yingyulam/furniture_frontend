import { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import FurnitureDataService from "../services/furniture.js";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./DnDCard.css";

const style = {
	padding: "10px",
	marginBottom: ".5rem",
	backgroundColor: "white",
};

export const DnDCard = ({ id, index, moveCard, draggable }) => {
	const ItemTypes = {
		CARD: "card",
	};

	const ref = useRef(null);

	const [{ handlerId }, drop] = useDrop({
		accept: ItemTypes.CARD,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;
			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}
			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();
			// Get vertical middle
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			// Determine mouse position
			const clientOffset = monitor.getClientOffset();
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			// Time to actually perform the action
			moveCard(dragIndex, hoverIndex);
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.CARD,
		item: () => {
			return { id, index };
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const opacity = isDragging ? 0 : 1;
	const cursor = draggable ? "move" : "default";

	if (draggable) {
		drag(drop(ref));
	}

	const [furniture, setFurniture] = useState({
		id: null,
		name: "",
	});

	useEffect(() => {
		const getFurniture = (id) => {
			FurnitureDataService.getFurnitureById(id)
				.then((response) => {
					setFurniture(response.data);
				})
				.catch((e) => {
					console.log(e);
				});
		};
		getFurniture(id);
	}, [id]);

	const ranking = index + 1;

	return (
		<div
			ref={ref}
			style={{ ...style, opacity, cursor }}
			data-handler-id={handlerId}
		>
			{
				<Card className="favoritesCard">

        <div>
						<Card.Text 
							className={
								ranking < 10
									? "favoritesNumber favoritesNumberOneDigit"
									: "favoritesNumber favoritesNumberTwoDigit"
							}
						>
							{ranking}
						</Card.Text>
					</div>

					<div>
						<Image
							className="favoritesPoster"
							src={furniture.imageUrl}
							onError={({ currentTarget }) => {
								currentTarget.onerror = null;
								currentTarget.src = "/images/NoImageAvailable.jpg";
							}}
						/>
					</div>

					<div className="favoritesTitle">
						<Card.Text>{furniture.name}</Card.Text>
					</div>

          <div className="favoritesTitle">
						<Card.Text>${furniture.price}</Card.Text>
					</div>

          <div className="favoritesTitle">
            <Button
              size="sm"
              href={"/furniture/" + furniture._id}
              variant="outline-secondary"
            >
              Details
            </Button>
          </div>

				</Card>
			}
		</div>
	);
};
