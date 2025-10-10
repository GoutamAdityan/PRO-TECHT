import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NumberBoxProps {
  value: number;
}

const NumberBox = ({ value }: NumberBoxProps) => (
  <div className="relative w-10 h-14 md:w-12 md:h-16 lg:w-14 lg:h-20 overflow-hidden rounded-lg bg-primary-foreground/10 flex items-center justify-center text-foreground text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums">
    <AnimatePresence initial={false}>
      <motion.span
        key={value}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

const FakeCountdown = () => {
  const [days, setDays] = useState(12);
  const [hours, setHours] = useState(23);
  const [minutes, setMinutes] = useState(45);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          setMinutes((prevMinutes) => {
            if (prevMinutes === 0) {
              setHours((prevHours) => {
                if (prevHours === 0) {
                  setDays((prevDays) => (prevDays === 0 ? 12 : prevDays - 1)); // Loop days
                  return 23;
                }
                return prevHours - 1;
              });
              return 59;
            }
            return prevMinutes - 1;
          });
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm shadow-lg border border-border/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-700 dark:text-purple-300">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Premium Warranty Countdown
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200">Featured</Badge>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-4">
          <CardDescription className="text-center mb-4 text-muted-foreground">
            Your "Quantum Leap 5000" warranty expires in:
          </CardDescription>
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
            <div className="flex flex-col items-center">
              <NumberBox value={days} />
              <span className="text-xs md:text-sm text-muted-foreground mt-1">Days</span>
            </div>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">:</span>
            <div className="flex flex-col items-center">
              <NumberBox value={hours} />
              <span className="text-xs md:text-sm text-muted-foreground mt-1">Hours</span>
            </div>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">:</span>
            <div className="flex flex-col items-center">
              <NumberBox value={minutes} />
              <span className="text-xs md:text-sm text-muted-foreground mt-1">Minutes</span>
            </div>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">:</span>
            <div className="flex flex-col items-center">
              <NumberBox value={seconds} />
              <span className="text-xs md:text-sm text-muted-foreground mt-1">Seconds</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Product: <span className="font-medium text-foreground">Quantum Leap 5000</span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FakeCountdown;
