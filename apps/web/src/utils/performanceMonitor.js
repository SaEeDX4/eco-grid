export const measureRenderTime = (componentName) => {
  const start = performance.now();

  return () => {
    const end = performance.now();
    const duration = end - start;

    if (duration > 16.67) {
      // Slower than 60fps
      console.warn(`${componentName} render took ${duration.toFixed(2)}ms`);
    }
  };
};

// Usage in components:
// const endMeasure = measureRenderTime('TestimonialCard')
// ... component logic ...
// endMeasure()
