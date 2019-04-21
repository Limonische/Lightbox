// Lazy loading for images
const lazyLoadImages = async () => {
    const lazyImages = [...document.querySelectorAll('img.lazy')];

    // Load selected image
    const loadLazyImage = lazyImage => {
        const { src, srcset } = lazyImage.dataset;

        if (src) lazyImage.src = src;
        if (srcset) lazyImage.srcset = srcset;
        lazyImage.classList.remove('lazy');
    };

    // Check for IntersectionObserver support and load polyfill if needed
    if (!('IntersectionObserver' in window)
        || !('IntersectionObserverEntry' in window)
        || !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
        await import(/* webpackChunkName: 'intersection-observer' */ 'intersection-observer');
    }

    // Create observer for lazy images
    const lazyImageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;

                loadLazyImage(lazyImage);
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });

    // Check for requestIdleCallback support and load polyfill if needed
    if (!('requestIdleCallback' in window)) {
        await import(/* webpackChunkName: 'request-idle-callback' */ 'requestidlecallback-polyfill');
    }

    lazyImages.forEach(lazyImage => {
        // Observe lazy images
        lazyImageObserver.observe(lazyImage);

        // Load images when browser is free
        requestIdleCallback(() => {
            loadLazyImage(lazyImage);
            lazyImageObserver.unobserve(lazyImage);
        });
    });
};

export default lazyLoadImages;
