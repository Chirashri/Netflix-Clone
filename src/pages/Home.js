import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import requests from "../requests";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Home() {
  const [myList, setMyList] = useState([]);
  const navigate = useNavigate();

  // Protect Route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch My List from Backend
  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const res = await API.get("/auth/mylist");
        setMyList(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMyList();
  }, []);

  const updateMyList = (list) => {
    setMyList(list);
  };

  return (
    <div className="home">
      <Navbar />
      <Banner />

      {myList.length > 0 && (
        <Row
          title="My List"
          moviesProp={myList}
          isMyList={true}
          updateMyList={updateMyList}
        />
      )}

      <Row title="Trending Now" fetchUrl={requests.fetchTrending} updateMyList={updateMyList} />
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} updateMyList={updateMyList} />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} updateMyList={updateMyList} />
      <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} updateMyList={updateMyList} />
      <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} updateMyList={updateMyList} />
    </div>
  );
}

export default Home;
