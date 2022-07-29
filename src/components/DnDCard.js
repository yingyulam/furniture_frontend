import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import MovieDataService from '../services/movies.js';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import './DnDCard.css';

const style = {
  padding: '10px',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}


export const DnDCard = ({ id, index, moveCard }) => {

  const ItemTypes = {
    CARD: 'card',
  }

  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1

  drag(drop(ref))

  const [movie, setMovie] = useState({
    id: null,
    title: ""
  });

  useEffect(() => {
    const getMovie = id => {
      MovieDataService.getMovieById(id).then((response) => {
        setMovie(response.data);
      }).catch(e => { console.log(e)});
    }
    getMovie(id)
  }, [id]);

  const ranking = index + 1;

  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {
        <Card className='favoritesCard'>
          <div>
          <Image
            className="favoritesPoster"
            src={movie.poster+"/100px250"}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src="/images/NoPosterAvailable-crop.jpg"
            }}
            />
          </div>
          
          <div className='favoritesTitle'>
            <Card.Text >{movie.title}</Card.Text>
          </div>

          <div>
            <Card.Text 
              className={
                ranking < 10? "favoritesNumber favoritesNumberOneDigit"
                      : "favoritesNumber favoritesNumberTwoDigit"}>
                  { ranking }
            </Card.Text>
          </div>

        </Card>

      }
    </div>
  )

}
