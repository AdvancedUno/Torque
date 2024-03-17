import StarOutline from "@/components/icons/StarOutline";
import styled from "styled-components";
import {useState} from "react";
import StarSolid from "@/components/icons/StarSolid";
import {primary} from "@/lib/colors";

const StarsWrapper = styled.div`
  display: inline-flex;
  gap: 1px;
  align-items: center;
`;
const StarWrapper = styled.button`
  ${props => props.size === 'md' && `
    height: 1.4rem;
    width: 1.4rem;
  `}
  ${props => props.size === 'sm' && `
    height: 1rem;
    width: 1rem;
  `}
  ${props => !props.disabled && `
    cursor: pointer;
  `}
  padding: 0;
  border:0;
  display: inline-block;
  background-color: transparent;
  color:${primary};
`;


export default function StarsRating({
  size='md',
  defaultHowMany=0,disabled,onChange
}) {
  const [howMany,setHowMany] = useState(defaultHowMany);
  const five = [1,2,3,4,5];
  function handleStarClick(n) {
    if (disabled) {
      return;
    }
    setHowMany(n);
    onChange(n);
  }
  return (
    <StarsWrapper>
      {five.map(n => (
        <>
          <StarWrapper
            disabled={disabled}
            size={size}
            onClick={() => handleStarClick(n)}>
            {howMany >= n ? <StarSolid /> : <StarOutline />}
          </StarWrapper>
        </>
      ))}
    </StarsWrapper>
  );
}