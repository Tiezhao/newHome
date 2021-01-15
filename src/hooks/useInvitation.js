import  { useState, useEffect } from 'react'

export  const useInvitation = (url) => {
  const [referrer, setReferrer] = useState('');

  useEffect(() => {
    let referrer = ''
    if (url.indexOf('douinvitecode') !== -1) {
      const str = url.substr(1);
      const strs = str.split('douinvitecode=');
      referrer = strs[1]
    }
    if (referrer && referrer.length >= 6) {
      setReferrer(referrer.substring(0, 6))

    }

  }, []);
  return [referrer];
};


