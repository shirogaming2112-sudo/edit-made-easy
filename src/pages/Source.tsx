import { useEffect, useState } from 'react';
import { useParams } from '@/lib/router-compat';
import Index from './Index';
import NotFound from './NotFound';
import { setSourcing, setSourceName } from '@/lib/headhunting';

const Source = () => {
  const { name } = useParams<{ name: string }>();
  const [ready, setReady] = useState(false);
  const [ref, setRef] = useState('');

  useEffect(() => {
    if (!name) return;
    setSourcing(true);
    setSourceName(name);
    setRef(new URLSearchParams(window.location.search).get('ref') || '');
    setReady(true);
    return () => {
      setSourcing(false);
      setSourceName('');
    };
  }, [name]);

  if (!name) return <NotFound />;
  if (!ready) return null;
  return <Index defaultReferralLink={ref} />;
};

export default Source;
