import React from 'react';
import { useSwipeable } from 'react-swipeable';

export const SwipeableTask = ({ children, onComplete, onDelete }: any) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onComplete(),
    onSwipedRight: () => onDelete(),
    trackMouse: true,
  });

  return <div {...handlers}>{children}</div>;
};