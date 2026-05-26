import React, { createContext, useContext, useState, useEffect } from 'react';
import { getScholarships, createScholarship, updateScholarship, deleteScholarship } from '../services/api';

const ScholarshipContext = createContext();

export const useScholarships = () => useContext(ScholarshipContext);

export const ScholarshipProvider = ({ children }) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const data = await getScholarships();
      setScholarships(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const add = async (scholarship) => {
    const newScholarship = await createScholarship(scholarship);
    setScholarships([...scholarships, newScholarship]);
  };

  const update = async (id, updatedData) => {
    const updated = await updateScholarship(id, updatedData);
    setScholarships(scholarships.map((s) => (s.id === id ? updated : s)));
  };

  const remove = async (id) => {
    await deleteScholarship(id);
    setScholarships(scholarships.filter((s) => s.id !== id));
  };

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships,
        loading,
        error,
        add,
        update,
        remove,
        refresh: fetchScholarships
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};
