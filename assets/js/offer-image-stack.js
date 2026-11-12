/**
 * Offer Image Stack
 * Frontend Interaction
 * Version: 2.5.4
 */

(function () {

    'use strict';

    const initialized = new WeakMap();

    /**
     * Find connected native Elementor Icon List.
     */
    function findIconList(connectionId) {

        if (!connectionId) {
            return null;
        }

        const widgets = document.querySelectorAll(
            '[data-offer-stack]'
        );

        for (const widget of widgets) {

            if (
                widget.getAttribute('data-offer-stack') !==
                connectionId
            ) {
                continue;
            }

            const list = widget.querySelector(
                '.elementor-icon-list-items'
            );

            if (list) {
                return list;
            }

        }

        return null;
    }


    /**
     * Get Icon List items.
     */
    function getListItems(list) {

        if (!list) {
            return [];
        }

        return Array.from(
            list.querySelectorAll(
                ':scope > .elementor-icon-list-item'
            )
        );

    }


    /**
     * Extract Icon List text.
     */
    function getItemText(item) {

        const textElement = item.querySelector(
            '.elementor-icon-list-text'
        );

        return textElement
            ? textElement.textContent
                .replace(/\s+/g, ' ')
                .trim()
            : '';

    }


    /**
     * Repeatable random generator.
     */
    function createRandomGenerator(seed) {

        let value = seed || 92821;

        return function () {

            value = (value * 16807) % 2147483647;

            return (value - 1) / 2147483646;

        };

    }


    /**
     * Arrange overlapping images.
     */
    function arrangeImages(root, cards) {

        const random = createRandomGenerator(
            Array.from(root.id).reduce(
                function (total, char) {

                    return total + char.charCodeAt(0);

                },
                92821
            )
        );

        const rotation = Number(
            root.dataset.rotation
        ) || 15;

        const offset = Number(
            root.dataset.offset
        ) || 25;

        const order = cards.map(function (_, index) {

            return index;

        });

        /*
         * Shuffle stacking order.
         */

        for (
            let i = order.length - 1;
            i > 0;
            i--
        ) {

            const j = Math.floor(
                random() * (i + 1)
            );

            [order[i], order[j]] = [
                order[j],
                order[i]
            ];

        }

        cards.forEach(function (card, index) {

            const x = (
                random() * 2 - 1
            ) * offset;

            const y = (
                random() * 2 - 1
            ) * offset;

            const angle = (
                random() * 2 - 1
            ) * rotation;

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


    /**
     * Activate an image.
     */
    function activateImage(cards, index) {

        cards.forEach(function (card, cardIndex) {

            const active = cardIndex === index;

            card.classList.toggle(
                'is-active',
                active
            );

            card.setAttribute(
                'aria-hidden',
                active ? 'false' : 'true'
            );

        });

    }


    /**
     * Connect list items to images.
     */
    function connectInteractions(items, cards) {

        items.forEach(function (item, index) {

            if (index >= cards.length) {
                return;
            }

            const card = cards[index];

            const label = getItemText(item);

            if (!label) {
                return;
            }

            /*
             * Store offer name.
             */

            card.dataset.offerLabel = label;

            card.dataset.offerIndex = index;

            card.setAttribute(
                'title',
                label
            );

            /*
             * Desktop hover.
             */

            item.addEventListener(
                'mouseenter',
                function () {

                    if (
                        window.matchMedia(
                            '(hover: hover)'
                        ).matches
                    ) {

                        activateImage(
                            cards,
                            index
                        );

                    }

                }
            );

            /*
             * Keyboard accessibility.
             */

            item.addEventListener(
                'focusin',
                function () {

                    activateImage(
                        cards,
                        index
                    );

                }
            );

            /*
             * Mobile interaction.
             */

            item.addEventListener(
                'click',
                function () {

                    if (
                        window.matchMedia(
                            '(hover: none)'
                        ).matches
                    ) {

                        activateImage(
                            cards,
                            index
                        );

                    }

                }
            );

        });

    }


    /**
     * Initialise one image stack.
     */
    function initialiseStack(root) {

        if (initialized.has(root)) {
            return;
        }

        const connectionId = root.dataset.connection;

        if (!connectionId) {

            root.classList.add(
                'ois-no-connection'
            );

            return;

        }

        const stage = root.querySelector(
            '.ois-stage'
        );

        if (!stage) {
            return;
        }

        /*
         * Find connected Icon List.
         */

        const list = findIconList(
            connectionId
        );

        if (!list) {

            root.classList.add(
                'ois-no-connection'
            );

            return;

        }

        /*
         * Get images and labels.
         */

        const cards = Array.from(
            stage.querySelectorAll('.ois-card')
        );

        const items = getListItems(list);

        if (!cards.length || !items.length) {
            return;
        }

        /*
         * Match available cards to list items.
         */

        const visibleCount = Math.min(
            cards.length,
            items.length
        );

        /*
         * Hide cards without matching list items.
         */

        cards.forEach(function (card, index) {

            if (index < visibleCount) {

                card.style.display = '';

            } else {

                card.style.display = 'none';

            }

        });

        const visibleCards = cards.slice(
            0,
            visibleCount
        );

        /*
         * Arrange images.
         */

        arrangeImages(
            root,
            visibleCards
        );

        /*
         * Set initial active image.
         */

        activateImage(
            visibleCards,
            0
        );

        /*
         * Connect Icon List interactions.
         */

        connectInteractions(
            items,
            visibleCards
        );

        /*
         * Record connection information.
         */

        root.dataset.connectedItems = visibleCount;

        root.dataset.connectionStatus = 'connected';

        root.classList.remove(
            'ois-no-connection'
        );

        initialized.set(
            root,
            list
        );

    }


    /**
     * Initialise all image stacks.
     */
    function initialiseAll() {

        document.querySelectorAll(
            '.offer-image-stack'
        ).forEach(function (root) {

            initialiseStack(root);

        });

    }


    /**
     * Watch for Elementor dynamically rendered widgets.
     */
    function observeChanges() {

        if (!document.body) {
            return;
        }

        const observer = new MutationObserver(
            function (mutations) {

                let shouldRefresh = false;

                mutations.forEach(function (mutation) {

                    if (
                        mutation.type === 'childList' &&
                        (
                            mutation.addedNodes.length ||
                            mutation.removedNodes.length
                        )
                    ) {

                        shouldRefresh = true;

                    }

                });

                if (shouldRefresh) {
                    initialiseAll();
                }

            }
        );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }


    /**
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


    /**
     * Document ready.
     */
    if (
        document.readyState === 'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            start
        );

    } else {

        start();

    }

})();
