import { useEffect, useState } from 'react';
import Index from './Index';
import { setHeadhunting } from '@/lib/headhunting';

const HeadHunting = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHeadhunting(true);
    setReady(true);
    return () => setHeadhunting(false);
  }, []);

  const ref = new URLSearchParams(window.location.search).get('ref') || '';

  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default HeadHunting;
