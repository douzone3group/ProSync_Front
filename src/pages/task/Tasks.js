import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TasksList from "../../components/task/common/TasksList";
import TaskNavigation from "../../components/task/common/TaskNavigation";
import TaskSearchBar from "../../components/task/common/TaskSearchBar";
import { styled } from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getTasks,
  taskListAction,
} from "../../redux/reducers/task/taskList-slice";
import { getTaskStatus } from "../../redux/reducers/task/taskStatus-slice";
import { BiExit } from "react-icons/bi";
import { deleteApi } from "../../util/api";
import { tryFunc } from "../../util/tryFunc";
import axiosInstance from "../../util/axiosInstancs";
import { getCookie } from "../../util/cookies";

export default function Tasks() {
  const dispatch = useDispatch();

  const params = useParams();
  const [keyword, setKeyword] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const [checkStatus, setCheckStatus] = useState(false);
  const navigate = useNavigate();

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const changeKeywordHandler = (value) => {
    setKeyword(value);
  };

  const [projectMember, setProjectMember] = useState();

  useEffect(() => {
    dispatch(getTaskStatus(params.projectId));
    const memberId = getCookie("memberId");
    tryFunc(
      () =>
        axiosInstance.get(`/projects/${params.projectId}/members/${memberId}`),
      (response) => setProjectMember(response.data)
    )();
  }, [dispatch, params.projectId]);

  useEffect(() => {
    dispatch(taskListAction.setTaskList({ list: [], pageInfo: {} }));
    const boardParams =
      view === "board"
        ? {
            size: 1000,
            view,
          }
        : null;
    dispatch(
      getTasks(params.projectId, {
        search: keyword,
        page: currentPage,
        ...boardParams,
        isActive: true,
      })
    );
  }, [dispatch, params.projectId, keyword, currentPage, view, checkStatus]);

  // TABLE VIEW 체크박스 로직
  const [checkbox, setCheckbox] = useState([]);

  const memberProjectExitHandler = () => {
    const proceed = window.confirm(
      "해당 프로젝트를 나갈 경우 복구가 불가합니다. 나가시겠습니까?"
    );

    if (proceed) {
      const text = window.prompt(
        "해당 프로젝트를 나가시려면 [나가기]를 입력하세요."
      );
      if (text === "나가기") {
        tryFunc(
          () => deleteApi(`/projects/${params.projectId}/members`),
          () => {
            navigate("/");
          },
          {
            403: (error) => {
              alert(
                "프로젝트 관리자는 프로젝트 회원에게 권한 위임 후 나갈 수 있습니다."
              );
            },
          }
        )();
      }
    }
  };
  return (
    <>
      <TaskView>
        {projectMember && (
          <TopButton>
            <ExitButton type="button" onClick={memberProjectExitHandler}>
              <BiExit size="20px" />
              프로젝트 나가기
            </ExitButton>
          </TopButton>
        )}
        <TaskSearchBar
          updateSearch={changeKeywordHandler}
          onChangePage={(value) => handleCurrentPage(value)}
        />
        <TaskNavigation
          onCheck={() => setCheckStatus((prv) => !prv)}
          checkedTasks={checkbox}
          updateCheckbox={(value) => setCheckbox(value)}
          projectMember={projectMember}
        />
        <TasksList
          onChangePage={handleCurrentPage}
          currentPage={currentPage}
          updateCheckbox={(value) => setCheckbox(value)}
          checkbox={checkbox}
          projectMember={projectMember}
        />
      </TaskView>
    </>
  );
}

const TaskView = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
`;

const ExitButton = styled.button`
  display: flex;
  align-self: flex-end;
  gap: 10px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  background-color: #e71d36;
  border-radius: 5px;
  justify-content: flex-end;
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TopButton = styled.div`
  display: flex;
  width: 80%;
  justify-content: flex-end;
`;
