import { useState, useEffect } from "react";
import "./ProjectForm.scss";
import { UpdateCheckBox } from "../../components/Ui/UpdateCheckbox";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination/Pagination";

export const UpdateProject = () => {
  const { projectId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [updatedMembers, setUpdatedMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [pageChange, setPageChange] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 2;

  const API_URL_MEMBERS = `${process.env.REACT_APP_BASE_URL}/projects/${projectId}/`;

  const handleUpdateSuccess = () => {
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

  useEffect(() => {
    const fetchMembers = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const memberArr = response.data.members;
        setMembers(memberArr);
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMembers(API_URL_MEMBERS);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/projects/${projectId}/`,
        {
          description: description,
          updatedMembers: updatedMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      handleUpdateSuccess();
    } catch (error) {
      if (error.response && error.response.data) {
        const validationErrors = Object.values(error.response.data).join("\n");
        setValidationError(validationErrors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Layout>
      <div className="main">
        {validationError && (
          <Alert variant="danger" className="mt-1">
            <ul>
              {validationError.split("\n").map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}
        <div className="header">
          <h2>Update Project</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-boxes">
            <div className="form-group">
              <input
                className="project-input"
                type="title"
                id="title"
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                style={{ color: "black" }}
                readOnly
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
                style={{ color: "black" }}
                required
              />
            </div>
          </div>
          <p className="add-members-text">Update Members:</p>
          <div className="form-group">
            <input
              type="text"
              className="search-bar"
              placeholder="Search Members"
              onChange={handleSearch}
            ></input>
          </div>
          <div className="checkbox">
            <UpdateCheckBox
              users={users}
              members={members}
              updatedMembers={setUpdatedMembers}
            />
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
              Update Project
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
