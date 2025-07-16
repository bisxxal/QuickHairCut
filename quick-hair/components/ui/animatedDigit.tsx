// components/AnimatedDigit.jsx
import { motion, AnimatePresence } from 'framer-motion';

const digitVariants = {
  initial: (direction) => ({
    y: direction > 0 ? -20 : 20,
    opacity: 0,
    position: 'absolute',
  }),
  animate: {
    y: 0,
    opacity: 1,
    position: 'absolute',
    transition: { duration: 0.3 },
  },
  exit: (direction) => ({
    y: direction > 0 ? 20 : -20,
    opacity: 0,
    position: 'absolute',
    transition: { duration: 0.3 },
  }),
};

export default function AnimatedDigit({ digit, prevDigit }) {
  const direction = digit > prevDigit ? 1 : -1;

  return (
    <div  
      style={{
        // position: 'relative',
        width: '1ch',
        height: '1.2em',
        overflow: 'hidden',
        display: 'inline-block',
      }}
    >
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.span
          key={digit}
          custom={direction}
          variants={digitVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ display: 'inline-block' }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
