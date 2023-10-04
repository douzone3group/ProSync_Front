import React, { useState, useEffect, useCallback } from "react";
import NotificationList from "./../../components/notification/NotificationList";
import { getApi, patchApi } from "../../util/api";
import { json, useLocation, useNavigate } from "react-router-dom";
import Pagination from "./../../components/notification/Pagination";
import styled from "styled-components";
import UpperBar from "./../../components/notification/UpperBar";
import { tryFunc } from "./../../util/tryFunc";
import { setIsLoggedIn } from "../../redux/reducers/loginSlice";
import { setTrigger } from "../../redux/reducers/notificationTrigger-slice";
import { useSelector } from "react-redux";

const Loading = styled.div`
  color: gray;
  font-weight: 900;
  width: 30rem;
  height: 10rem;
  margin-left: 40%;
  margin-top: 10%;
  color: gray;
  font-weight: 900;
  width: 30rem;
  height: 10rem;
  margin-left: 40%;
  margin-top: 10%;
`;

const Container = styled.div`
  width: 80%;
  height: 100%;
  margin-left: 15%;
  margin-top: 2.5%;
`;

const codeInformation = [
  {
    id: 1,
    code: "TASK_REMOVE",
    value: "업무삭제",
  },
  {
    id: 2,
    code: "TASK_ASSIGNMENT",
    value: "업무지정",
  },
  {
    id: 3,
    code: "TASK_MODIFICATION",
    value: "업무수정",
  },
  {
    id: 4,
    code: "TASK_EXCLUDED",
    value: "업무제외",
  },
  {
    id: 5,
    code: "PROJECT_ASSIGNMENT",
    value: "프로젝트지정",
  },
  {
    id: 6,
    code: "PROJECT_EXCLUDED",
    value: "프로젝트제외",
  },
  {
    id: 7,
    code: "PROJECT_MODIFICATION",
    value: "프로젝트수정",
  },
  {
    id: 8,
    code: "PROJECT_REMOVE",
    value: "프로젝트삭제",
  },
  {
    id: 9,
    code: "COMMENT_ADD",
    value: "댓글추가",
  },
  {
    id: 10,
    code: "COMMENT_REMOVE",
    value: "댓글삭제",
  },
  {
    id: 11,
    code: "COMMENT_MODIFICATION",
    value: "댓글수정",
  },
  {
    id: 12,
    code: "CHANGE_AUTHORITY",
    value: "권한변경",
  },
];

const PersonalNotification = (props) => {
  const [notificationPageList, setNotificationPageList] = useState([]);
  const [notificationPageInfo, setNotificationPageInfo] = useState({
    page: "",
    size: "",
    totalElements: "",
    totalPages: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notReadCount, setNotReadCount] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const fetchNotificationCount = async () => {
    const response = await getApi("/notification/count");
    return response.data;
  };

  const onNotificationCountSuccess = (data) => {
    setNotReadCount(data);
  };

  

  const countErrorHandler = {
    401: (error) => {
      console.log(error.response.status);
      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      setIsLoggedIn(false);
      navigate(
        `/auth?mode=login&returnUrl=${location.pathname}${location.search}`
      );
    },
    default: (error) => {
      console.error("Unknown error:", error);
      alert("알림 읽기 처리 중 오류가 발생했습니다.");
    },
  };

  useEffect(() => {
    console.log("count 불림");
    tryFunc(
      fetchNotificationCount,
      onNotificationCountSuccess,
      countErrorHandler
    )();
  }, [location]);

  const fetchNotificationList = async () => {
    const response = await getApi(`notificationList?${queryParams.toString()}`);
    return response.data;
  };

  const onFetchNotificationListSuccess = (data) => {
    setNotificationPageList(data.data);
    setNotificationPageInfo(data.pageInfo);
    setIsLoading(false);
  };

  const getNotificationListErrorHandler = {
    500: (error) => {
      console.error("Server Error:", error);
      alert("서버에서 오류가 발생했습니다.");
    },
    404: (error) => {
      console.error("Not Found:", error);
      alert("알림 정보를 찾을 수 없습니다.");
    },
    401: (error) => {
      console.log(error.response.status);
      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      setIsLoggedIn(false);
      navigate(
        `/auth?mode=login&returnUrl=${location.pathname}${location.search}`
      );
    },
    default: (error) => {
      console.error("Unknown error:", error);
      alert("알림 목록을 가져오는 중 오류가 발생하였습니다.");
    },
  };

  useEffect(() => {
    const getNotiList = async () => {
      setIsLoading(true);
      console.log("Notification 정보를 위해 useEffect에서 데이터 요청함");
      tryFunc(
        fetchNotificationList,
        onFetchNotificationListSuccess,
        getNotificationListErrorHandler
      )();
    };

    getNotiList();
  }, [location]);

  const fetchAllReadNotification = async () => {
    const response = await patchApi("/notification/allRead");
    return response.data;
  };

  const onAllReadSuccess = (data) => {
    setNotReadCount(data);
    setTrigger();
    alert("모든 알림을 읽음 처리 하였습니다.");
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const allReadErrorHandler = {
    401: (error) => {
      console.log("여기지나감");
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
      alert("알림 목록을 가져오는 중 오류가 발생하였습니다.");
    },
  };

  const AllRead = useCallback(() => {
    if (window.confirm("모든 알림을 읽음 처리하시겠습니까?")) {
      tryFunc(
        fetchAllReadNotification,
        onAllReadSuccess,
        allReadErrorHandler
      )();
    } else {
      alert("읽음 처리를 취소하셨습니다.");
    }
  }, []);

  return (
    <Container>
      <UpperBar
        isPersonal={true}
        codeInformation={codeInformation}
        notReadCount={notReadCount}
        AllRead={AllRead}
        count={notificationPageInfo.totalElements}
      />
      {!isLoading && (
        <>
          <NotificationList notiPageList={notificationPageList} />
          <Pagination
            pageInfo={notificationPageInfo}
            pageCount={5}
            isPersonal={true}
          />
        </>
      )}
      {isLoading && (
        <Loading>데이터를 로딩중입니다. 잠시만 기다려주세요.</Loading>
      )}
    </Container>
  );
};

export default PersonalNotification;
