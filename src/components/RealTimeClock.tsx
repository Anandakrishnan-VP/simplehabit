import { useState, useEffect } from 'react';

export const RealTimeClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="text-center mb-8">
      <p className="font-mono text-2xl font-bold tracking-wider">
        {formatTime(now)}
      </p>
      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground mt-1">
        {formatDate(now)}
      </p>
    </div>
  );
};
