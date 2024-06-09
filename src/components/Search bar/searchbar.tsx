import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
}

const SearchBarWithData: React.FC = (project) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);

  useEffect(() => {
    setData(project.project.map((p) => p.name));
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredData.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBarWithData;
