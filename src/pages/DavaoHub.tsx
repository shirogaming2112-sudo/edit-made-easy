import { useEffect, useState } from 'react';
import Index from './Index';
import { setDavaohub } from '@/lib/headhunting';

const DavaoHub = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDavaohub(true);
    setReady(true);
    return () => setDavaohub(false);
  }, []);

  const ref = typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('ref') || '') : '';

  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default DavaoHub;
