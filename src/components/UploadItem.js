import { useState } from "react";
import { useNavigate } from "react-router";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import MovieDataService from "../services/movies";

const UploadItem = ({ user }) => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [price, setPrice] = useState();
	const [description, setDescription] = useState("");

	const saveItem = () => {
		let data = {
			user_id: user.googleId,
			name: name,
			price: price,
			description: description,
		};

		MovieDataService.uploadItem(data)
			.then((res) => navigate("/movies"))
			.catch((e) => console.log(e));
	};

	const onChangeName = (e) => {
		setName(e.target.value);
	};

	const onChangePrice = (e) => {
		setPrice(e.target.value);
	};

	const onChangeDescription = (e) => {
		setDescription(e.target.value);
	};

	return (
		<div>
			<h2>Create item for sell on this website!</h2>
			<Container className="main-container">
				<Form>
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							required
							value={name}
							onChange={onChangeName}
						/>
						<Form.Control
							type="number"
							required
							value={price}
							onChange={onChangePrice}
						/>
						<Form.Control
							as="textarea"
							type="text"
							required
							value={description}
							onChange={onChangeDescription}
						/>
					</Form.Group>
					<Button variant="primary" onClick={saveItem}>
						Submit
					</Button>
				</Form>
			</Container>
		</div>
	);
};

export default UploadItem;
