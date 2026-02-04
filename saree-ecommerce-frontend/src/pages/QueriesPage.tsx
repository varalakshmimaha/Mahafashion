import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardTabs from '../components/dashboard/DashboardTabs';

const QueriesPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState<any[]>([]);

  useEffect(() => {
    // Placeholder: in future, fetch user's queries from API when endpoint exists
    setLoading(true);
    setTimeout(() => {
      setQueries([]);
      setLoading(false);
    }, 200);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DashboardTabs />
      <h1 className="text-2xl font-semibold mb-4">My Queries</h1>
      {!isAuthenticated && (
        <p className="text-gray-600">Please log in to view your queries.</p>
      )}

      {isAuthenticated && (
        <div>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : queries.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-gray-700">You have no queries yet.</div>
          ) : (
            <ul className="space-y-3">
              {queries.map((q) => (
                <li key={q.id} className="bg-white p-4 rounded shadow">{q.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default QueriesPage;
