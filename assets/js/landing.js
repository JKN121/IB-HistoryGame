/**
 * Landing page behaviour: theme toggle button and the hero slideshow.
 * The theme itself lives in theme.js, which every page shares.
 */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Carousel elements only exist on index.html, so every use below is guarded.
    const carouselImg = document.getElementById('carousel-image');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    const carouselSlides = ['hero-1', 'hero-2', 'hero-3'];
    let currentSlideIndex = 0;

    // Screenshots ship as <base-name>-light.jpg / <base-name>-dark.jpg pairs.
    function syncImagesToTheme() {
        const suffix = ChronoTheme.isDark() ? '-dark.jpg' : '-light.jpg';

        document.querySelectorAll('.theme-sync-img').forEach(img => {
            const baseName = img.dataset.baseName;
            if (!baseName) return;

            // Fall back to the light shot if a themed variant is missing, so a
            // gap in the asset set never shows up as a broken image.
            img.onerror = () => {
                img.onerror = null;
                img.src = `assets/images/${baseName}-light.jpg`;
            };
            img.src = `assets/images/${baseName}${suffix}`;
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => ChronoTheme.toggle());
    }

    if (prevBtn && nextBtn && carouselImg) {
        const showSlide = index => {
            const count = carouselSlides.length;
            currentSlideIndex = ((index % count) + count) % count;
            carouselImg.dataset.baseName = carouselSlides[currentSlideIndex];
            syncImagesToTheme();
        };

        prevBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
    }

    ChronoTheme.onChange(syncImagesToTheme);
    syncImagesToTheme();
});
