import styled from "styled-components";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import StarsRating from "@/components/StarsRating";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

const Title = styled.h2`
  font-size:1.2rem;
  margin-bottom:5px;
`;
const Subtitle = styled.h3`
  font-size: 1rem;
  margin-top: 5px;
`;
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;
const ReviewWrapper = styled.div`
  margin-bottom: 10px;
  border-top: 1px solid #eee;
  padding: 10px 0;
  h3{
    margin:3px 0;
    font-size:1rem;
    color:#333;
    font-weight: normal;
  }
  p{
    margin:0;
    font-size: .7rem;
    line-height: 1rem;
    color:#555;
  }
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  time{
    font-size: 12px;
    color: #aaa;
  }
`;

export default function ProductReviews({product}) {
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [stars,setStars] = useState(0);
  const [reviews,setReviews] = useState([]);
  const [reviewsLoading,setReviewsLoading] = useState(false);
  function submitReview() {
    const data = {title,description,stars,product:product._id};
    axios.post('/api/reviews', data).then(res => {
      setTitle('');
      setDescription('');
      setStars(0);
      loadReviews();
    });
  }
  useEffect(() => {
    loadReviews();
  }, []);
  function loadReviews() {
    setReviewsLoading(true);
    axios.get('/api/reviews?product='+product._id).then(res => {
      setReviews(res.data);
      setReviewsLoading(false);
    });
  }
  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
        <div>
          <WhiteBox>
            <Subtitle>Add a review</Subtitle>
            <div>
              <StarsRating onChange={setStars} />
            </div>
            <Input
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              placeholder="Title" />
            <Textarea
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              placeholder="Was it good? Pros? Cons?" />
            <div>
              <Button primary onClick={submitReview}>Submit your review</Button>
            </div>
          </WhiteBox>
        </div>
        <div>
          <WhiteBox>
            <Subtitle>All reviews</Subtitle>
            {reviewsLoading && (
              <Spinner fullWidth={true} />
            )}
            {reviews.length === 0 && (
              <p>No reviews :(</p>
            )}
            {reviews.length > 0 && reviews.map(review => (
              <ReviewWrapper>
                <ReviewHeader>
                  <StarsRating size={'sm'} disabled={true} defaultHowMany={review.stars} />
                  <time>{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>
                </ReviewHeader>
                <h3>{review.title}</h3>
                <p>{review.description}</p>
              </ReviewWrapper>
            ))}
          </WhiteBox>
        </div>
      </ColsWrapper>
    </div>
  );
}