/**
 * Offer Image Stack
 * Integrated Frontend Interaction
 * Version: 3.0.1
 */

(function () {

    'use strict';

    const initializedRoots = new WeakSet();

    /*
     * Reproducible random generator.
     */
    function createRandomGenerator(seed) {

        let value = seed || 92821;

        return function () {

            value = (value * 16807) % 2147483647;

            return (value - 1) / 2147483646;

        };
    }

    /*
     * Arrange overlapping images.
     */
    function arrangeImages(root, cards) {

        if (!cards.length) {
            return;
        }

        const seed = Array.from(root.id || 'ois').reduce(
            function (total, char) {
                return total + char.charCodeAt(0);
            },
            92821
        );

        const random = createRandomGenerator(seed);

        const rotation = Number(root.dataset.rotation) || 15;
        const offset = Number(root.dataset.offset) || 25;

        const order = cards.map(function (_, index) {
            return index;
        });

        /*
         * Shuffle stacking order.
         */
        for (let i = order.length - 1; i > 0; i--) {

            const j = Math.floor(random() * (i + 1));

            [order[i], order[j]] = [
                order[j],
                order[i]
            ];
        }

        cards.forEach(function (card, index) {

            const ratio = Number(root.style.getPropertyValue('--ois-fit-ratio')) || 1;
            const x = (random() * 2 - 1) * offset * ratio;
            const y = (random() * 2 - 1) * offset * ratio;
            const angle = (random() * 2 - 1) * rotation;

            card.style.setProperty(
                '--ois-x',
                x.toFixed(1) + 'px'
            );

            card.style.setProperty(
                '--ois-y',
                y.toFixed(1) + 'px'
            );

            card.style.setProperty(
                '--ois-rotation',
                angle.toFixed(2) + 'deg'
            );

            card.style.setProperty(
                '--ois-z',
                order[index] + 1
            );

        });
    }


    /*
     * CSS transforms on absolutely positioned cards do not affect flex sizing.
     * Measure the rendered column and fit the entire rotated / active pile in it.
     */
    function fitStack(root) {
        const stage = root.querySelector('.ois-stage');
        const area = root.querySelector('.ois-image-area');
        if (!stage || !area) {
            return;
        }

        const cards = stage.querySelectorAll('.ois-card');
        if (!cards.length) {
            return;
        }

        const styles = window.getComputedStyle(root);
        const rawWidth = styles.getPropertyValue('--ois-card-width').trim();
        const rawHeight = styles.getPropertyValue('--ois-card-height').trim();
        const reference = document.createElement('div');
        reference.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:' +
            (rawWidth || '220px') + ';height:' + (rawHeight || '280px') + ';';
        stage.appendChild(reference);
        const desiredWidth = reference.getBoundingClientRect().width || 220;
        const desiredHeight = reference.getBoundingClientRect().height || 280;
        reference.remove();

        const rotation = Math.abs(Number(root.dataset.rotation) || 0) * Math.PI / 180;
        const offset = Math.abs(Number(root.dataset.offset) || 0);
        const scale = Math.max(1, Number(root.dataset.scale) || 1);
        const lift = Math.abs(Number(root.dataset.lift) || 0);
        const available = Math.max(0, area.clientWidth - 8);

        const rotatedWidth = Math.abs(desiredWidth * Math.cos(rotation)) +
            Math.abs(desiredHeight * Math.sin(rotation)) + 2 * offset;
        const requiredWidth = Math.max(rotatedWidth, desiredWidth * scale);
        const ratio = requiredWidth ? Math.min(1, available / requiredWidth) : 1;
        const width = Math.max(0, desiredWidth * ratio);
        const height = Math.max(0, desiredHeight * ratio);
        const effectiveOffset = offset * ratio;
        const effectiveLift = lift * ratio;
        const rotatedHeight = Math.abs(height * Math.cos(rotation)) +
            Math.abs(width * Math.sin(rotation)) + 2 * effectiveOffset;
        const stageHeight = Math.max(rotatedHeight, height * scale + 2 * effectiveLift) + 16;

        stage.style.minHeight = stageHeight + 'px';

        cards.forEach(function (card) {
            card.style.width = width + 'px';
            card.style.height = height + 'px';
        });

        root.style.setProperty('--ois-fit-ratio', ratio);
    }

    /*
     * Get all integrated list items.
     */
    function getListItems(root) {

        const list = root.querySelector('.ois-list');

        if (!list) {
            return [];
        }

        return Array.from(
            list.querySelectorAll(
                '.ois-list-entry > .ois-list-item'
            )
        );
    }

    /*
     * Find an image using its original repeater index.
     */
    function getCard(root, index) {

        const cards = root.querySelectorAll(
            '.ois-card[data-offer-index]'
        );

        return Array.from(cards).find(function (card) {

            return String(card.dataset.offerIndex) === String(index);

        }) || null;
    }

    /*
     * Activate an image.
     */
    function activateImage(root, index) {

        const cards = root.querySelectorAll('.ois-card');

        const activeCard = getCard(root, index);

        if (!activeCard) {
            return;
        }

        cards.forEach(function (card) {

            const active = card === activeCard;

            card.classList.toggle('is-active', active);

            card.setAttribute(
                'aria-hidden',
                active ? 'false' : 'true'
            );

        });

        /*
         * Update active list entry.
         */
        getListItems(root).forEach(function (item) {

            const active =
                String(item.dataset.oiIndex) === String(index);

            item.classList.toggle('is-active', active);

        });

    }

    /*
     * Connect integrated list entries to their images.
     */
    function connectInteractions(root) {

        /*
         * Desktop pointer interaction.
         */
        root.addEventListener('pointerover', function (event) {

            if (
                !window.matchMedia ||
                !window.matchMedia('(hover: hover)').matches
            ) {
                return;
            }

            const item = event.target.closest('.ois-list-item');

            if (!item || !root.contains(item)) {
                return;
            }

            /*
             * Ignore movement between child elements
             * inside the same list item.
             */
            if (
                event.relatedTarget &&
                item.contains(event.relatedTarget)
            ) {
                return;
            }

            activateImage(root, item.dataset.oiIndex);

        });

        /*
         * Keyboard interaction.
         */
        root.addEventListener('focusin', function (event) {

            const item = event.target.closest('.ois-list-item');

            if (!item || !root.contains(item)) {
                return;
            }

            activateImage(root, item.dataset.oiIndex);

        });

        /*
         * Touch interaction.
         *
         * Normal link navigation is preserved.
         */
        root.addEventListener('click', function (event) {

            const item = event.target.closest('.ois-list-item');

            if (!item || !root.contains(item)) {
                return;
            }

            const isTouch = window.matchMedia &&
                window.matchMedia('(hover: none)').matches;

            if (isTouch) {
                activateImage(root, item.dataset.oiIndex);
            }

        });

    }

    /*
     * Initialise one widget.
     */
    function initialiseStack(root) {

        if (!root) {
            return;
        }

        const stage = root.querySelector('.ois-stage');
        const list = root.querySelector('.ois-list');

        if (!stage || !list) {
            return;
        }

        const cards = Array.from(
            stage.querySelectorAll('.ois-card')
        );

        const items = getListItems(root);

        if (!cards.length || !items.length) {
            return;
        }

        /*
         * Build a map of available image indexes.
         */
        const availableIndexes = new Set(
            cards.map(function (card) {
                return String(card.dataset.offerIndex);
            })
        );

        /*
         * Arrange the images.
         */
        fitStack(root);
        arrangeImages(root, cards);

        /*
         * Ensure every list entry points to an existing image.
         */
        items.forEach(function (item) {

            const index = String(item.dataset.oiIndex);

            const hasImage = availableIndexes.has(index);

            item.classList.toggle(
                'ois-no-image',
                !hasImage
            );

        });

        /*
         * Set initial active image.
         */
        const firstItem = items.find(function (item) {

            return availableIndexes.has(
                String(item.dataset.oiIndex)
            );

        });

        if (firstItem) {

            activateImage(
                root,
                firstItem.dataset.oiIndex
            );

        }

        /*
         * Only attach delegated listeners once.
         */
        if (!initializedRoots.has(root)) {

            connectInteractions(root);

            initializedRoots.add(root);

        }

        if (!root._oisResizeObserver && window.ResizeObserver) {
            root._oisResizeObserver = new ResizeObserver(function () {
                fitStack(root);
                arrangeImages(root, cards);
            });
            root._oisResizeObserver.observe(root);
        }

        root.dataset.connectionStatus = 'connected';
        root.dataset.connectedItems = items.length;

    }

    /*
     * Initialise all widgets.
     */
    function initialiseAll() {

        document.querySelectorAll(
            '.offer-image-stack.ois-integrated'
        ).forEach(function (root) {

            initialiseStack(root);

        });

    }

    /*
     * Observe dynamically rendered Elementor widgets.
     */
    function observeChanges() {

        if (!document.body) {
            return;
        }

        const observer = new MutationObserver(function (mutations) {

            let shouldRefresh = false;

            mutations.forEach(function (mutation) {

                if (
                    mutation.type !== 'childList' ||
                    !mutation.addedNodes.length
                ) {
                    return;
                }

                mutation.addedNodes.forEach(function (node) {

                    if (node.nodeType !== 1) {
                        return;
                    }

                    if (
                        node.matches &&
                        node.matches('.offer-image-stack.ois-integrated')
                    ) {
                        shouldRefresh = true;
                    }

                    if (
                        node.querySelector &&
                        node.querySelector('.offer-image-stack.ois-integrated')
                    ) {
                        shouldRefresh = true;
                    }

                });

            });

            if (shouldRefresh) {
                initialiseAll();
            }

        });

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }

    /*
     * Start frontend functionality.
     */
    function start() {

        initialiseAll();

        observeChanges();

        /*
         * Elementor frontend integration.
         */
        if (
            window.elementorFrontend &&
            window.elementorFrontend.hooks
        ) {

            window.elementorFrontend.hooks.addAction(
                'frontend/element_ready/global',
                function () {

                    initialiseAll();

                }
            );

        }

    }

    /*
     * Document ready.
     */
    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            start
        );

    } else {

        start();

    }

})();
