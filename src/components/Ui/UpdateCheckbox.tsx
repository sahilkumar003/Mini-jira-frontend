import { useState, useEffect } from "react";
import "./CheckBox.scss";

export const UpdateCheckBox = ({ users, members, updatedMembers }) => {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const newArr = members.map((member) => {
      return member.id;
    });
    setIds(newArr);
    updatedMembers(newArr);
  }, [members]);

  const selectUser = (event) => {
    const selectedId = parseInt(event.target.value);

    if (ids.includes(selectedId)) {
      const newIds = ids.filter((id) => id !== selectedId);
      setIds(newIds);
      updatedMembers(newIds);
    } else {
      const newIds = [...ids];
      newIds.push(selectedId);
      setIds(newIds);
      updatedMembers(newIds);
    }
  };

  return (
    <div className="container">
      {users.length === 0 && <h4 className="loading">Loading...</h4>}
      {users.length > 0 &&
        users.map((user) => (
          <div className="userItem" key={user.email}>
            <span className="userName">{user.first_name}</span>
            <span className="userCheckbox">
              <input
                type="checkbox"
                value={user.id}
                onChange={selectUser}
                checked={ids.includes(user.id) ? true : false}
              />
            </span>
          </div>
        ))}
    </div>
  );
};
