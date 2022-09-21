import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";

const Search = () => {
  const [inputsearch, inputsetSearch] = useState("");
  const [startResult, setStartResult] = useState(false);
  const [currentPosts, setCurrentPosts] = useState();
  const [listArray, setListArray] = useState({
    chunkArr: [],
    pageIndexArr: [],
    currentpage: 1,
  });

  const setSearch = async (e) => {
    if (e.target.value.length > 0) {
      setStartResult(true);
    } else {
      setStartResult(false);
    }
    inputsetSearch(e.target.value);
    const response = await fetch(
      `https://itunes.apple.com/search?term=${e.target.value}&limit=50`
    );
    const info = await response.json();
    let listArr = [];
    for (let i = 0; i < info?.results?.length; i += 10) {
      const chunk = info?.results?.slice(i, i + 10);
      listArr.push(chunk);
    }
    const pageArr = [];
    for (let i = 1; i <= Math.ceil(info?.results?.length / 10); i++) {
      pageArr.push(i);
    }
    setListArray({ chunkArr: listArr, pageIndexArr: pageArr, currentpage: 1 });
  };

  const paginate = (pageNumber) => {
    console.log(listArray.chunkArr[pageNumber]);
    setListArray({
      chunkArr: listArray.chunkArr,
      pageIndexArr: listArray.pageIndexArr,
      currentpage: pageNumber,
    });
  };
  return (
    <Container>
      <Form.Control
        className="inputSearch"
        type="search"
        placeholder="Search Songs/Artists"
        value={inputsearch}
        onChange={(e) => setSearch(e)}
      ></Form.Control>
      {listArray.chunkArr[listArray.currentpage - 1]?.length > 0 &&
        listArray.chunkArr[listArray.currentpage - 1]?.map(
          (anObjectMapped, index) => {
            return (
              <>
                <div className="card">
                  <p>{anObjectMapped.trackName}</p>
                  <p>{anObjectMapped.artistName}</p>
                </div>
              </>
            );
          }
        )}
      {startResult && currentPosts?.length == 0 && (
        <div className="card">
          <p>No results</p>
        </div>
      )}
      <li>
        <ul className="pagination">
          {listArray?.pageIndexArr?.map((element) => (
            <li key={element} className="page-item">
              <a
                onClick={() => paginate(element)}
                href="#"
                className="page-link"
              >
                {element}
              </a>
            </li>
          ))}
        </ul>
      </li>
    </Container>
  );
};

export default Search;
