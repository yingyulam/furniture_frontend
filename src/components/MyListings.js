import React from "react";
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import "./MyListings.css";
import FurnitureDataService from "../services/furniture.js";
import Card from "react-bootstrap/Card";
import moment from "moment";

const MyListings = ({ user }) => {
	const [history, setHistory] = useState([]);

	useEffect(() => {
		FurnitureDataService.getHistoryByUserId(user.googleId)
			.then((response) => {
				setHistory(response.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	return (
		<div>
      <Card>
        <Card.Header as="h5">My Listings</Card.Header>
        <Table responsive className="historyTable">
          <thead>
            <tr>
              <th>Picture</th>
              <th>Title</th>
              <th>Price</th>
              <th>Posted</th>
              <th>Details</th>
            </tr>
          </thead>

          {history.map((furniture, i) => {
            return (
              <tbody key={i}>
							<tr>
                <td>
                  <Card.Img
											className="historyPicture"
											src={furniture.imageUrl}
											onError={({ currentTarget }) => {
												currentTarget.onerror = null;
												currentTarget.src = "/images/NoImageAvailable.jpg";
											}}
										/>
                </td>
                <td>{furniture.name}</td>
                <td>${furniture.price}</td>
                <td>{moment(furniture.date).format('MMMM DD, YYYY')}</td>
                <td>
                  <Button
                    className="mbe-3"
                    size="sm"
                    href={"/furniture/" + furniture._id}
                    variant="outline-secondary"
                  >
                    Details
									</Button>
                </td>
              </tr>
              </tbody>
            )
					})}



    </Table>
    </Card>
			
		</div>
	);
};

export default MyListings;