import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Dashboard() {
  const [name, setName] = useState('');
  const { id } = useParams(); // Extract id parameter from URL

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`http://localhost:8081/v1/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const responseData = await response.json();
        setName(responseData.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    })();
  }, [id]); // Re-run effect when id changes

  return (
    <div className='text-3xl'>Hi {name}</div>
  );
}

export default Dashboard;
