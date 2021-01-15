import { useState, useEffect } from 'react'

export const useLoginType = () => {
  const [type, setType] = useState();
  const [showAuth, setShowAuth] = useState();
  useEffect(() => {
    setType('login');
    setShowAuth(false)
  }, []);
  return [type, setType, showAuth, setShowAuth];
};

