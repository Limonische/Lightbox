import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

class Lightbox {
    options = {
        lightboxDisplay: 'flex',
        lightboxSelector: '.lightbox',
        lightboxImageSelector: '.lightbox__image',
        closeAttribute: 'close',
        prevAttribute: 'prev',
        nextAttribute: 'next',
        counterAttribute: 'counter',
        thumbnailAttribute: 'thumbnail',
        imageAttribute: 'image',
        bodyScrollLock: { reserveScrollBarGap: true },
        transitionDuration: 0.7,
        timingFunction: 'ease-in-out',
    };

    thumbnails = [];

    images = [];

    closers = [];

    nexts = [];

    prevs = [];

    counters = [];

    image = null;

    currentIndex = 0;

    opening = true;

    switching = false;

    constructor(gallery, options = {}) {
        this.gallery = gallery;
        this.options = {
            ...this.options,
            ...options,
        };
        this.lightbox = document.querySelector(this.options.lightboxSelector);
    }

    init() {
        if (!this.gallery || !this.lightbox) return;

        this.initThumbnails();
        this.initImages();
        this.initClosers();
        this.initNexts();
        this.initPrevs();
        this.initCounters();
        this.initImage();
    }

    initThumbnails() {
        this.thumbnails = [...this.gallery.querySelectorAll(`[data-lightbox-${this.options.thumbnailAttribute}]`)];

        this.thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', this.onThumbnailClick);
        });
    }

    initImages() {
        this.images = [...this.gallery.querySelectorAll(`[data-lightbox-${this.options.imageAttribute}]`)];
    }

    initClosers() {
        this.closers = [...this.lightbox.querySelectorAll(`[data-lightbox-${this.options.closeAttribute}]`)];
    }

    initNexts() {
        this.nexts = [...this.lightbox.querySelectorAll(`[data-lightbox-${this.options.nextAttribute}]`)];
    }

    initPrevs() {
        this.prevs = [...this.lightbox.querySelectorAll(`[data-lightbox-${this.options.prevAttribute}]`)];
    }

    initCounters() {
        this.counters = [...this.lightbox.querySelectorAll(`[data-lightbox-${this.options.counterAttribute}]`)];
    }

    initImage() {
        this.image = this.lightbox.querySelector(this.options.lightboxImageSelector);

        if (!this.image) return;

        this.image.style.transition = `opacity ${this.options.transitionDuration}s ${this.options.timingFunction}`;
        this.image.style.willChange = 'opacity';

        this.image.addEventListener('load', this.onImageLoad);
    }

    addEventListeners() {
        this.closers.forEach(closer => closer.addEventListener('click', this.onCloserClick));
        this.nexts.forEach(next => next.addEventListener('click', this.onNextClick));
        this.prevs.forEach(prev => prev.addEventListener('click', this.onPrevClick));
        document.addEventListener('keyup', this.onKeyUp);
    }

    removeEventListeners() {
        this.closers.forEach(closer => closer.removeEventListener('click', this.onCloserClick));
        this.nexts.forEach(next => next.removeEventListener('click', this.onNextClick));
        this.prevs.forEach(prev => prev.removeEventListener('click', this.onPrevClick));
        this.image.removeEventListener('load', this.onImageLoad);
        document.removeEventListener('keyup', this.onKeyUp);
    }

    onImageLoad = () => {
        this.image.style.opacity = 1;

        setTimeout(() => {
            this.switching = false;
        }, 200);
    }

    onThumbnailClick = e => {
        e.preventDefault();

        this.currentIndex = this.images.indexOf(e.target);
        this.open();
    }

    onCloserClick = e => {
        e.preventDefault();

        this.close();
    }

    onNextClick = e => {
        e.preventDefault();

        this.next();
    }

    onPrevClick = e => {
        e.preventDefault();

        this.prev();
    }

    onKeyUp = e => {
        const keyName = e.key;

        switch (keyName) {
        case 'Escape':
            this.close();
            break;
        case 'ArrowLeft':
            this.prev();
            break;
        case 'ArrowRight':
            this.next();
            break;
        default:
            break;
        }
    }

    onLightboxTransitionEnd = () => {
        enableBodyScroll(this.lightbox);
        this.lightbox.style.display = 'none';
        this.lightbox.removeEventListener('transitionend', this.onLightboxTransitionEnd);
    }

    open() {
        this.addEventListeners();
        this.setImage();
        this.setCounters();
        this.lightbox.style.display = this.options.lightboxDisplay;

        setTimeout(() => {
            disableBodyScroll(this.lightbox, this.options.bodyScrollLock);
            this.lightbox.classList.add('active');
        }, 100);
    }

    close() {
        this.opening = true;
        this.currentIndex = 0;
        this.image.style.willChange = 'auto';
        this.lightbox.classList.remove('active');
        this.lightbox.addEventListener('transitionend', this.onLightboxTransitionEnd);
    }

    setCounters() {
        this.counters.forEach(counter => {
            counter.innerHTML = `${this.currentIndex + 1} / ${this.images.length}`;
        });
    }

    setImage() {
        if (!this.image) return;

        if (this.opening) {
            this.opening = false;
            this.change();
        } else {
            this.image.style.opacity = 0;
            this.image.addEventListener('transitionend', this.change);
        }
    }

    change = () => {
        this.image.removeEventListener('transitionend', this.change);

        const currentImage = this.images[this.currentIndex];
        const {
            src = currentImage.src,
            srcset = currentImage.srcset,
            alt = currentImage.alt,
        } = currentImage.dataset;

        if (srcset) this.image.srcset = srcset;
        if (src) this.image.src = src;
        if (alt) this.image.alt = alt;
    }

    next() {
        if (this.switching) return;

        this.switching = true;

        if (this.currentIndex === this.images.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }

        this.setImage();
        this.setCounters();
    }

    prev() {
        if (this.switching) return;

        this.switching = true;

        if (this.currentIndex === 0) {
            this.currentIndex = this.images.length - 1;
        } else {
            this.currentIndex--;
        }

        this.setImage();
        this.setCounters();
    }
}

export default Lightbox;
