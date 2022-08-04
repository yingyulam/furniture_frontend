import React, { useState } from 'react';
import FurnitureDataService from "../services/furniture";
import { useNavigate, useParams, useLocation} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddReview = ({ user }) => {
  const navigate = useNavigate();
  let params = useParams();

  let editting = false;
  let initialReviewState = "";

  let location = useLocation();
  if (location.state != null) {
    editting = true;
    let currentReview = location.state.currentReview;
    initialReviewState = currentReview.review;
  }

  // initialReviewState will have a different value 
  // if we're editting an existing review
  const [review, setReview] = useState(initialReviewState);

  const onChangeReview = e => {
    const review = e.target.value;
    setReview(review);
  }

  const saveReview = () => {
    var data = {
      review: review,
      name: user.name,
      user_id: user.googleId,
      movie_id: params.id // get movie id from url
    }

    if (editting) {
      // TODO: Handle case where an existing 
      // review is being updated
      let currentReview = location.state.currentReview;
      FurnitureDataService.updateReview({...currentReview, review: review, review_id: currentReview._id})
      .then(response => {
        navigate("/furniture/"+params.id)
      })
      .catch(e => {
        console.log(e);
      })

    } else {
      FurnitureDataService.createReview(data)
        .then(response => {
          navigate("/furniture/"+params.id)
        })
        .catch(e => {
          console.log(e);
        })
    }
  }

  return (
    <Container className="main-container">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>{ editting ? "Edit" : "Create" }</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            required
            review={ review }
            onChange={ onChangeReview }
            defaultValue={ editting ? review : "" }   // changed default editing value
          />
        </Form.Group>
        <Button variant="primary" onClick={ saveReview }>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default AddReview;