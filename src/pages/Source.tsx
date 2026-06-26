import { useEffect, useState } from 'react';
import { useParams } from '@/lib/router-compat';
import Index from './Index';
import NotFound from './NotFound';
import { setSourcing, setSourceName, setHeadhunting } from '@/lib/headhunting';

const Source = () => {
  const { name } = useParams<{ name: string }>();
  const [ready, setReady] = useState(false);
  const [ref, setRef] = useState('');

  useEffect(() => {
    if (!name) return;
    // Mirror the head-hunting flow so all isHeadhunting()-gated UI is active,
    // while still tagging the contact as sourced with the dynamic :name.
    setHeadhunting(true);
    setSourcing(true);
    setSourceName(name);
    setRef(new URLSearchParams(window.location.search).get('ref') || '');
    setReady(true);
    return () => {
      setHeadhunting(false);
      setSourcing(false);
      setSourceName('');
    };
  }, [name]);

  if (!name) return <NotFound />;
  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default Source;
