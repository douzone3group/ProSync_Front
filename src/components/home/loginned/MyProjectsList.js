import React from "react";
import { styled } from "styled-components";
import { getApi } from "../../../util/api";
import { useEffect } from "react";
import { useState } from "react";
import { setIsLoggedIn } from "../../../redux/reducers/loginSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { tryFunc } from "./../../../util/tryFunc";
import MyProject from "./MyProject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
  align-items: center;

  & > .left-direction {
    margin-right: 2%;
    color: ${props=> props.startPage ? '#eaefff':'#cc58ed'};
    cursor: ${props=> props.startPage ? 'null':'pointer'};
  }

  & > .left-direction:hover {
    color: ${props=> props.startPage ? 'null':'#7d7575'};

  }

  & > .right-direction {
    margin-left: 2%;
    color: ${props=> props.endPage ? '#eaefff':'#cc58ed'};
    cursor: ${props=> props.endPage ? 'null':'pointer'};
  }

  & > .right-direction:hover {
    color: ${props=> props.endPage ? 'null':'#7d7575'};
  }
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 2rem;
  column-gap: 1rem;
  width: 100%;
  height: 100%;
`;

const MyProjectsList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const handleNext = () => {
    if (page < maxPage) {
        setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const fetchMyProjectsList = async () => {
    const response = await getApi(`/my-projects?page=${page}&size=6`);
    return response.data;
  };

  const fetchMyProjectListSuccess = (data) => {
    setProjectsList(data.data);
    setMaxPage(data.pageInfo.totalPages);
    setIsLoading(false);
    console.log("fetch :");
    console.log(data);
  };

  const fetchMyProjectsListErrorHandler = {
    401: (error) => {
      console.log(error.response.status);
      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      setIsLoggedIn(false);
      navigate(
        `/auth?mode=login&returnUrl=${location.pathname}${location.search}`
      );
    },
    500: (error) => {
      console.error("Server Error:", error);
      alert("서버에서 오류가 발생했습니다.");
    },

    default: (error) => {
      console.error("Unknown error:", error);
      alert("내 프로젝트 목록을 가져오는 중 오류가 발생하였습니다.");
    },
  };

  useEffect(() => {
    setIsLoading(true);
    tryFunc(
      fetchMyProjectsList,
      fetchMyProjectListSuccess,
      fetchMyProjectsListErrorHandler
    )();
  }, [page, maxPage]);

  return (
    <Container startPage={page===1} endPage={page===maxPage}>
      {isLoading ? (
        <div>데이터 로딩중입니다.</div>
      ) : (
        <>
          <FontAwesomeIcon
            className="left-direction"
            icon={faAngleLeft}
            size="5x"
            onClick={handlePrev}
          />
          <ListContainer>
            {projectsList.map((project) => (
              <MyProject key={project.projectId} project={project} />
            ))}
          </ListContainer>
          <FontAwesomeIcon
            className="right-direction"
            icon={faAngleRight}
            size="5x"
            onClick={handleNext}
          />
        </>
      )}
    </Container>
  );
};

export default MyProjectsList;

