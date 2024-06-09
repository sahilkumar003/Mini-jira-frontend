import React, { useState, useEffect, useRef } from "react";
import "./ProjectForm.scss";
import { CheckBox } from "../../components/Ui/CheckBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination/Pagination";

interface User {
  id: number;
  first_name: string;
  email: string;
  last_name: string;
  dob: Object;
  password: string;
}

export const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [potentialMembers, setPotentialMembers] = useState<Array<User>>([]);
  const [search, setSearch] = useState("");
  const [pageChange, setPageChange] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 2;

  const handleSignupSuccess = () => {
    navigate("/dashboard");
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const API_URL_SEARCH = `${
      process.env.REACT_APP_BASE_URL
    }/users/?search=${search}&&limit=5&offset=${(pageChange - 1) * 5}`;
    const fetchData = setTimeout(() => {
      try {
        const promise = axios
          .get(API_URL_SEARCH, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((res) => {
            setUsers(res.data.results);
            setPageCount(Math.ceil(res.data.count / 5));
          });
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(fetchData);
  }, [search, pageChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/projects/`,
        {
          title: title,
          description: description,
          members: potentialMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      handleSignupSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="main">
        <div className="header">
          <h2>Create Project</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="project-input"
              type="title"
              id="title"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="project-input"
              id="desciption"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <p className="add-members-text">Add Members:</p>
          <div className="form-group">
            <input
              type="text"
              className="search-bar"
              placeholder="Search Members"
              onChange={handleSearch}
            ></input>
          </div>
          <div className="checkbox">
            <CheckBox users={users} setPotentialMembers={setPotentialMembers} />
          </div>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={pageCount}
            pageSize={PageSize}
            onPageChange={(page) => {
              setPageChange(page);
              setCurrentPage(page);
            }}
          />

          <div className="add-project-btn">
            <button type="submit" onClick={handleSubmit}>
              Add Project
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
