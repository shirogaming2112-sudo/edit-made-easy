import { useEffect, useState } from 'react';
import Index from './Index';
import { setDavaohub } from '@/lib/headhunting';

const DavaoHub = () => {
  const [ready, setReady] = useState(false);
  const [ref, setRef] = useState('');

  useEffect(() => {
    setDavaohub(true);
    setRef(new URLSearchParams(window.location.search).get('ref') || '');
    setReady(true);
    return () => setDavaohub(false);
  }, []);

  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default DavaoHub;
