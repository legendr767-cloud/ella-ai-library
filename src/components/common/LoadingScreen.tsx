import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <BookOpen className="h-12 w-12 text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-muted-foreground"
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
}
