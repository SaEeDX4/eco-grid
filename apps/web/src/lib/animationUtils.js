// Animation and scroll utilities

export const easeOutQuart = (t) => {
  return 1 - Math.pow(1 - t, 4);
};

export const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const animateValue = (
  start,
  end,
  duration,
  callback,
  easing = easeOutQuart
) => {
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const currentValue = start + (end - start) * easedProgress;
    callback(currentValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export const observeIntersection = (elements, callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target, entry);
      }
    });
  }, defaultOptions);

  if (Array.isArray(elements)) {
    elements.forEach((el) => observer.observe(el));
  } else {
    observer.observe(elements);
  }

  return observer;
};

export const staggerAnimation = (elements, animationFn, delayMs = 100) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      animationFn(element, index);
    }, index * delayMs);
  });
};

export const parallaxScroll = (element, speed = 0.5) => {
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * speed;
    element.style.transform = `translate3d(0, ${rate}px, 0)`;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => window.removeEventListener("scroll", handleScroll);
};

export const pulseGlow = (element, duration = 2000) => {
  element.style.animation = `pulse-glow ${duration}ms ease-in-out infinite`;
};

// CSS keyframes for pulse-glow (add to global styles)
export const pulseGlowKeyframes = `
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5);
  }
}
`;
