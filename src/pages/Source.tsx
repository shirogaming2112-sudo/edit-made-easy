import { useEffect, useState } from 'react';
import { useParams } from '@/lib/router-compat';
import Index from './Index';
import NotFound from './NotFound';
import { setSourcing, setSourceName } from '@/lib/headhunting';

const Source = () => {
  const { name } = useParams<{ name: string }>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!name) return;
    setSourcing(true);
    setSourceName(name);
    setReady(true);
    return () => {
      setSourcing(false);
      setSourceName('');
    };
  }, [name]);

  if (!name) return <NotFound />;

  const ref = new URLSearchParams(window.location.search).get('ref') || '';

  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default Source;
