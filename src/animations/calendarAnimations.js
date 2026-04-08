import { gsap } from 'gsap';

export const runFlipAnimation = ({ pageRef, direction, onMidpoint, onComplete }) => {
  const isForward = direction === 'forward';
  const target = pageRef.current;
  if (!target) return;

  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(target, { rotationX: 0, y: 0, z: 0, opacity: 1 });
      onComplete();
    },
  });

  if (isForward) {
    timeline.to(target, {
      duration: 0.7,
      rotationX: -180,
      y: -100,
      z: 150,
      ease: 'power2.inOut',
      onComplete: onMidpoint,
    });
    return;
  }

  gsap.set(target, { rotationX: -180, z: 150, y: -100, opacity: 0 });
  timeline
    .to(target, { duration: 0.1, opacity: 1 })
    .to(target, {
      duration: 0.7,
      rotationX: 0,
      y: 0,
      z: 0,
      ease: 'back.out(1)',
      onStart: onMidpoint,
    });
};

