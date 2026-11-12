/**
 * Offer Image Stack
 * Elementor Editor Integration
 * Version: 2.1.1
 */

(function ($) {
    'use strict';

    const OIS = {

        activeModel: null,
        syncing: false,

        /**
         * Normalise labels for matching.
         */
        normaliseText: function (text) {

            return String(text || '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

        },

        /**
         * Find Elementor preview documents.
         */
        getDocuments: function () {

            const documents = [];

            const iframe = document.querySelector(
                '#elementor-preview-iframe'
            );

            if (iframe) {

                try {

                    if (iframe.contentDocument) {
                        documents.push(iframe.contentDocument);
                    }

                } catch (error) {

                    console.warn('OIS: Preview iframe unavailable.', error);

                }

            }

            documents.push(document);

            return documents;

        },

        /**
         * Find connected Icon List.
         */
        findConnectedList: function (connectionId) {

            if (!connectionId) {
                return null;
            }

            const documents = this.getDocuments();

            for (const doc of documents) {

                const elements = doc.querySelectorAll(
                    '[data-offer-stack]'
                );

                for (const element of elements) {

                    if (
                        element.getAttribute('data-offer-stack') !==
                        connectionId
                    ) {
                        continue;
                    }

                    const list = element.querySelector(
                        '.elementor-icon-list-items'
                    );

                    if (list) {
                        return list;
                    }

                }

            }

            return null;

        },

        /**
         * Read Icon List labels.
         */
        getLabels: function (list) {

            if (!list) {
                return [];
            }

            return Array.from(
                list.querySelectorAll(
                    '.elementor-icon-list-item'
                )
            ).map(function (item) {

                const text = item.querySelector(
                    '.elementor-icon-list-text'
                );

                return text
                    ? text.textContent.replace(/\s+/g, ' ').trim()
                    : '';

            }).filter(Boolean);

        },

        /**
         * Read existing repeater entries.
         */
        getExistingOffers: function (model) {

            const settings = model.get('settings');

            if (!settings) {
                return [];
            }

            let offers = settings.get('offers') || [];

            if (typeof offers.toJSON === 'function') {
                offers = offers.toJSON();
            }

            if (!Array.isArray(offers)) {
                return [];
            }

            return offers.map(function (offer) {

                if (typeof offer.toJSON === 'function') {
                    return offer.toJSON();
                }

                return Object.assign({}, offer || {});

            });

        },

        /**
         * Match existing images with new labels.
         */
        synchroniseOffers: function (labels, existingOffers) {

            const lookup = new Map();

            existingOffers.forEach(function (offer) {

                const key = OIS.normaliseText(
                    offer.offer_name || ''
                );

                if (!key) {
                    return;
                }

                if (!lookup.has(key)) {
                    lookup.set(key, []);
                }

                lookup.get(key).push(offer);

            });

            return labels.map(function (label) {

                const key = OIS.normaliseText(label);

                const matches = lookup.get(key);

                /*
                 * Preserve existing matching entry.
                 */
                if (matches && matches.length) {

                    const existing = matches.shift();

                    return Object.assign({}, existing, {
                        offer_name: label,
                        image_alt: label,
                        label_key: key
                    });

                }

                /*
                 * Create a new entry.
                 */
                return {

                    offer_name: label,

                    offer_image: {
                        id: '',
                        url: ''
                    },

                    image_alt: label,

                    label_key: key

                };

            });

        },

        /**
         * Display Elementor notification.
         */
        notify: function (message, type) {

            if (
                window.elementor &&
                elementor.notifications &&
                typeof elementor.notifications.showToast === 'function'
            ) {

                elementor.notifications.showToast({
                    message: message,
                    type: type || 'info'
                });

            } else {

                window.alert(message);

            }

        },

        /**
         * Perform synchronisation.
         */
        sync: function () {

            if (this.syncing) {
                return;
            }

            const model = this.activeModel;

            if (!model) {

                this.notify(
                    'Widget not detected. Close the panel and reopen Offer Image Stack.',
                    'danger'
                );

                console.error(
                    'OIS: No active widget model.'
                );

                return;

            }

            const settings = model.get('settings');

            if (!settings) {

                this.notify(
                    'Unable to read Offer Image Stack settings.',
                    'danger'
                );

                return;

            }

            const connectionId = settings.get(
                'connection_id'
            );

            if (!connectionId) {

                this.notify(
                    'Please enter a Connection ID.',
                    'warning'
                );

                return;

            }

            /*
             * Find connected Icon List.
             */
            const list = this.findConnectedList(
                connectionId
            );

            if (!list) {

                this.notify(
                    'Icon List not found. Check its Advanced attribute: data-offer-stack|' +
                    connectionId,
                    'danger'
                );

                console.error(
                    'OIS: Could not find connected Icon List.',
                    connectionId
                );

                return;

            }

            /*
             * Read labels.
             */
            const labels = this.getLabels(list);

            if (!labels.length) {

                this.notify(
                    'No text items found in the connected Icon List.',
                    'warning'
                );

                return;

            }

            this.syncing = true;

            try {

                /*
                 * Read existing images.
                 */
                const existingOffers = this.getExistingOffers(
                    model
                );

                /*
                 * Match and preserve existing images.
                 */
                const syncedOffers = this.synchroniseOffers(
                    labels,
                    existingOffers
                );

                /*
                 * Update Elementor's widget model.
                 */
                if (typeof model.setSetting === 'function') {

                    model.setSetting(
                        'offers',
                        syncedOffers
                    );

                } else {

                    settings.set(
                        'offers',
                        syncedOffers
                    );

                }

                /*
                 * Store sync information.
                 */
                if (typeof model.setSetting === 'function') {

                    model.setSetting(
                        'ois_last_sync_count',
                        syncedOffers.length
                    );

                }

                console.log(
                    'OIS: Synchronisation successful.',
                    syncedOffers
                );

                this.notify(
                    'Successfully synced ' +
                    syncedOffers.length +
                    ' items. Existing matching images have been preserved.',
                    'success'
                );

            } catch (error) {

                console.error(
                    'OIS: Synchronisation error.',
                    error
                );

                this.notify(
                    'Sync failed. Please check the browser console.',
                    'danger'
                );

            } finally {

                this.syncing = false;

            }

        },

        /**
         * Register Elementor integration.
         */
        init: function () {

            if (
                !window.elementor ||
                !elementor.channels ||
                !elementor.channels.editor ||
                !elementor.hooks
            ) {

                console.error(
                    'OIS: Elementor editor API unavailable.'
                );

                return;

            }

            /*
             * Remember the widget when its panel opens.
             */
            elementor.hooks.addAction(
                'panel/open_editor/widget/offer-image-stack',
                function (panel, model) {

                    OIS.activeModel = model;

                    console.log(
                        'OIS: Offer Image Stack selected.',
                        model
                    );

                }
            );

            /*
             * Listen for the Sync button.
             */
            elementor.channels.editor.on(
                'ois:sync-icon-list',
                function () {

                    console.log(
                        'OIS: Sync button clicked.'
                    );

                    OIS.sync();

                }
            );

            console.log(
                'OIS: Elementor editor integration loaded.'
            );

        }

    };


    /**
     * Initialise once Elementor is ready.
     */
    $(window).on(
        'elementor:init',
        function () {

            OIS.init();

        }
    );


})(jQuery);
