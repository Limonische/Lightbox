// Styles
import '../sass/styles.sass';

// Libraries

// Modules
import lazyLoadImages from './imports/lazyLoadImages';
import Lightbox from './imports/Lightbox';

window.addEventListener('load', () => {
    lazyLoadImages();

    const galleries = [...document.querySelectorAll('.gallery')];
    galleries.forEach(gallery => {
        const lightbox = new Lightbox(gallery);

        lightbox.init();
    });
});
