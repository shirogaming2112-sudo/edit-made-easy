import { useEffect, useState } from 'react';
import Index from './Index';
import { setHeadhunting } from '@/lib/headhunting';

const HeadHunting = () => {
  const [ready, setReady] = useState(false);
  const [ref, setRef] = useState('');

  useEffect(() => {
    setHeadhunting(true);
    setRef(new URLSearchParams(window.location.search).get('ref') || '');
    setReady(true);
    return () => setHeadhunting(false);
  }, []);

  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default HeadHunting;
