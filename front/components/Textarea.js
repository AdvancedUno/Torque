import styled from "styled-components";

const StyledArea = styled.textarea`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing:border-box;
  font-family:inherit;
`;

export default function Textarea(props) {
  return <StyledArea {...props} />;
}