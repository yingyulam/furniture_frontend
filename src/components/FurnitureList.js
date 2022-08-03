import React, { useState, useEffect, useCallback } from 'react';
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsStar, BsStarFill } from "react-icons/bs";
import "./FurnitureList.css";


const FurnitureList = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite,
}) => {
    // useState to set state values
    const [furniture, setFurniture] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    // const [searchRating, setSearchRating] = useState("");
    // const [ratings, setRatings] = useState(["All Ratings"]);
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(0);
    const [currentSearchMode, setCurrentSearchMode] = useState("");

    // useCallback to define functions which should only be created once 
    // and will be dependencies for useEffect

    // const retrieveRatings = useCallback(() => {
    //     MovieDataService.getRatings()
    //         .then(response => {
    //             setRatings(["All Ratings"].concat(response.data))
    //         })
    //         .catch(e => {
    //             console.log(e);
    //         });
    // }, []);

    const retrieveFurniture = useCallback(() => {
        setCurrentSearchMode("");
        MovieDataService.getAll(currentPage)
        .then(response => {
            setFurniture(response.data.movies);
            setCurrentPage(response.data.page);
            setEntriesPerPage(response.data.entries_per_page);
        })
        .catch(e => {
            console.log(e);
        });
    }, [currentPage]);

    const find = useCallback((query, by) => {
        MovieDataService.find(query, by, currentPage)
        .then(response => {
            setFurniture(response.data.movies);
        })
        .catch(e => {
            console.log(e);
        });
    }, [currentPage]);

    const findByTitle = useCallback(() => {
        setCurrentSearchMode("findByTitle");
        find(searchTitle, "title");
    }, [find, searchTitle]);

    // const findByRating = useCallback(() => {
    //     setCurrentSearchMode("findByRating");
    //     if (searchRating === "All Ratings") {
    //         retrieveFurniture();
    //     } else {
    //         find(searchRating, "rated");
    //     }
    // }, [find, searchRating, retrieveFurniture]);

    const retrieveNextPage = useCallback(() => {
        if (currentSearchMode === "findByTitle") {
            findByTitle();
        // } else if (currentSearchMode === "findByRating") {
        //     findByRating();
        } else {
            retrieveFurniture();
        }
    }, [currentSearchMode, findByTitle, retrieveFurniture]);


    // Use effect to carry out side effect functionality
    // useEffect(() => {
    //     retrieveRatings();
    // }, [retrieveRatings]);

    useEffect(() => {
        setCurrentPage(0);
    }, [currentSearchMode]);

    // Retrieve the next page if currentPage value changes
    useEffect(() => {
        retrieveNextPage();
    }, [currentPage, retrieveNextPage]);

    
    // Other functions that are not depended on by useEffect
    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    }

    // const onChangeSearchRating = e => {
    //     const searchRating = e.target.value;
    //     setSearchRating(searchRating);
    // }

    return (
        <div className="App">
            <Container className="main-container">
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                placeholder="Search by title"
                                value={searchTitle}
                                onChange={onChangeSearchTitle} 
                                />
                            </Form.Group>
                            <Button
                              variant="primary"
                              type="button"
                              onClick={findByTitle}
                            >
                              Search
                            </Button>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            {/* <Form.Control
                              as="select"
                              onChange={onChangeSearchRating}
                            >
                              { ratings.map((rating, i) => {
                                return (
                                  <option value={rating}
                                  key={i}>
                                    {rating}
                                  </option>
                                )
                              })}
                            </Form.Control> */}
                          </Form.Group>
                          {/* <Button
                            variant="primary"
                            type="button"
                            onClick={findByRating}
                          >
                            Search
                          </Button> */}
                        </Col>
                    </Row>
                </Form>
                <Row className="movieRow">
                  { furniture.map((furniture) => {
                    return (
                      <Col key={furniture._id}>
                        <Card className="moviesListCard">
                        { user && (
                          favorites.includes(furniture._id) ?
                          <BsStarFill className="star starFill" onClick={() => {
                            deleteFavorite(furniture._id);
                          }}/>
                          :
                          <BsStar className="star starEmpty" onClick={() => {
                            addFavorite(furniture._id);
                          }} />
                        )}
                          <Card.Img
                            className="smallPoster"
                            src={furniture.imageUrl} 
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src="/images/NoPosterAvailable-crop.jpg"
                            }}
                            />
                            <Card.Body>
                              <Card.Title> {furniture.name} </Card.Title>
                              {/* <Card.Text>
                                Rating: {movie.rated}
                              </Card.Text> */}
                              <Card.Text>
                                Price: ${furniture.price}
                              </Card.Text>
                              <Card.Text>
                                {furniture.desc}
                              </Card.Text>
                              <Link to={"/movies/" + furniture._id}>
                                View Product
                              </Link>
                            </Card.Body>
                        </Card>
                      </Col>
                    )
                  })}
                </Row>
                <br />
                Showing page: { currentPage + 1 },
                <Button
                  variant="link"
                  onClick={() => { setCurrentPage(currentPage + 1)} } 
                >
                  Get next { entriesPerPage } results
                </Button>
            </Container>
        </div>
    )
}


export default FurnitureList;