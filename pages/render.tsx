'use client'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '@components/loader';
import Message from '@components/message';
import Resume from '@components/resume';
import styles from '@styles/message.module.scss';

export default function Page() {
  const router = useRouter();
  const { url, theme } = router.query;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [renderedHtml, setRenderedHtml] = useState(null);

  useEffect(() => {
    if (!url) return;
    console.log(decodeURIComponent(url as string));
    fetch(url as string)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch resume data: ${res.status}`);
        return res.json();
      })
      .then(async (resumeData) => {
        if (theme && theme !== 'default') {
          // Use theme-based rendering
          const res = await fetch(`/api/render?theme=${theme}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resumeData)
          });
          if (!res.ok) throw new Error(`Failed to render theme: ${res.status}`);
          const html = await res.text();
          setRenderedHtml(html);
        } else {
          // Use default React component rendering
          setData(resumeData);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [decodeURIComponent(url as string), theme]);

  if (isLoading) return <Loader />;
  if (error) return <div className={styles.container}><Message msg={error.message} /></div>;
  if (renderedHtml) {
    // Render themed HTML
    return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
  }
  if (data) return <Resume resume={data} />;
  return <div className={styles.container}><Message msg="No resume data provided" /></div>;
} 