import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { staticPageAPI } from '../services/api';

const StaticPageViewer: React.FC = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const res = await staticPageAPI.get(slug);
        setPage(res);

        // Update document title and meta description
        if (res.meta_title) document.title = res.meta_title;
        else if (res.title) document.title = res.title;

        if (res.meta_description) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', res.meta_description || '');
        }
      } catch (e: any) {
        setError(e.message || 'Page not found');
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) return <div className="container mx-auto p-4">Loading page...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!page) return <div className="container mx-auto p-4">Page not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content || '' }} />
    </div>
  );
};

export default StaticPageViewer;
