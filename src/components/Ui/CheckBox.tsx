import React, { useState } from "react";
import "./CheckBox.scss";

export const CheckBox = ({ users, setPotentialMembers }) => {
  const [ids, setIds] = useState<Array<number>>([]);

  const selectUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = parseInt(event.target.value);

    if (ids.includes(selectedId)) {
      const newIds = ids.filter((id) => id !== selectedId);
      setIds(newIds);
      setPotentialMembers(newIds);
    } else {
      const newIds = [...ids, selectedId];
      setIds(newIds);
      setPotentialMembers(newIds);
    }
  };

  return (
    <div className="container">
      {users.length === 0 && <h4 className="loading">Loading...</h4>}
      {users.length > 0 &&
        users.map((user) => (
          <div className="userItem" key={user.email}>
            <span className="userName">
              {user.first_name} {user.last_name}
            </span>
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
