import React from 'react';
import { Reaction } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionOverlayProps {
  reactions: Reaction[];
  videoWidth: number;
  videoHeight: number;
}

export const ReactionOverlay: React.FC<ReactionOverlayProps> = ({
  reactions,
  videoWidth,
  videoHeight,
}) => {
  // Filter to only show reactions from the last 5 seconds
  const recentReactions = reactions.filter(
    (reaction) => new Date().getTime() - reaction.timestamp.getTime() < 5000
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {recentReactions.map((reaction) => {
          // Calculate position
          const x = reaction.position.x * videoWidth;
          const y = reaction.position.y * videoHeight;

          return (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 2 }}
              className="absolute text-3xl"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {reaction.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};