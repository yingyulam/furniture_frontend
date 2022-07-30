import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import './Movie.css'

const Furniture = ({ user }) => {

  let params = useParams();

  const [furniture, setFurniture] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  useEffect(() => {
    const getFurniture = id => {
      MovieDataService.getMovieById(id).then((response) => {
        setFurniture(response.data);
      }).catch(e => { console.log(e)});
    }
    getFurniture(params.id)
  }, [params.id]);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div className="poster">
              <Image
                className="bigPicture"
                src={furniture.poster+"/100px250"}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src="/images/NoPosterAvailable-crop.jpg"
                }}
                fluid />
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h3">{furniture.title}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <h5>Price: {furniture.year}</h5>
                </Card.Text>
                <Card.Text>
                  <h5>Condition: {furniture.rated}</h5>
                </Card.Text>
                <Card.Text>
                  <h5>Description</h5>
                  <p>{furniture.plot}</p>
                </Card.Text>
                {/* { user &&
                  <Link to={"/movies/" + params.id + "/review"} >
                    Add Review
                  </Link>} */}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header as="h5">Seller Information</Card.Header>
              <Card.Body>
              <Card.Text>
                Name: {furniture.directors}
              </Card.Text>
              <Card.Text>
                Contact: {furniture.year*1000000+furniture.year}
              </Card.Text>
              </Card.Body>
            </Card>



            {/* <h2>Reviews</h2>
            <br></br>
            { furniture.reviews.map((review, index) => {
              return (
                <div className="d-flex">
                  <div className="flex-shrink-0 reviewsText">
                    <h5>{review.name + " review on "} { moment(review.date).format("Do MMMM YYYY") }</h5>
                    <p className="review">{review.review}</p>
                    { user && user.googleId === review.user_id &&
                      <Row>
                        <Col>
                          <Link to={{
                            pathname: "/movies/"+params.id+"/review"
                          }}
                            state = {{
                              currentReview: review
                          }} >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button variant="link" onClick={ () =>
                            { 
                              // TODO: Implement delete behavior
                              MovieDataService.deleteReview({...review, review_id: review._id})
                                .then(response => {
                                  setFurniture((prevState) => {
                                    prevState.reviews.splice(index, 1);
                                    return ({
                                      ...prevState
                                    })
                                  })
                                })
                                .catch(e => {
                                  console.log(e);
                                })                              

                            } }>
                              Delete
                            </Button>
                        </Col>
                      </Row>
                    }
                  </div>
                </div>
              ) */
            /* })} */}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Furniture;