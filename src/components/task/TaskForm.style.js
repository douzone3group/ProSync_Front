import { styled } from "styled-components";
import ReactQuill from "react-quill";

export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
`;

export const MarkdownInput = styled(ReactQuill)`
  .ql-editor {
    font-size: 1.05rem;
    line-height: 1.5;
    height: 500px;

    a {
      text-decoration: underline;
    }
  }
`;

export const TaskTitle = styled.input`
  max-height: 100px;
  width: 100%;
  font-size: 1.2rem;
  padding: 1rem;
`;

export const DateInput = styled.input`
  height: 40px;
  width: 120px;
  padding: 1rem;
  font-size: 1rem;
`;

export const Period = styled.div`
  display: flex;
`;

export const MainTask = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 70%;
`;

export const SideTask = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 240px;

  & > div {
    border-bottom: 1px solid #dad7cd;
    padding-bottom: 1rem
  }
`;

export const SideInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 5px;
  font-size: 1rem;
  border: none;
`;

export const TaskArea = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
  width: 1500px;
  margin: 20px 0;
`;

export const SideName = styled.div`
  margin-bottom: 1.2rem;
  font-weight: bold;
`;

export const Container = styled.div`
  position: relative;
`;

export const CalendarWrapper = styled.div`
  position: absolute;
  top: 83px;
  left: 0;
  display: ${(props) => (props.show ? "block" : "none")};
`;

export const TaskStatusBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  div {
    flex: 2;
  }
`;

export const ChooseStatusComment = styled.div`
  height: 50px;
  font-size: 18x;
  min-width: 100px;
  text-align: center;
  line-height: 50px;
  max-width: 150px;
  font-size: 0.8rem;
`;

export const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const ButtonArea = styled.div`
  display: flex;
  gap: 0.7rem;
`;
