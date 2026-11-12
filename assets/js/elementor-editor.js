
/**
 * Offer Image Stack
 * Elementor Editor Integration
 * Version: 2.2.0
 */

(function ($) {
    'use strict';

    const OIS = {

        activeModel: null,
        syncing: false,
        initialized: false,

        /**
         * Normalise text for matching existing images.
         */
        normaliseText: function (text) {

            return String(text || '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

        },

        /**
         * Convert a Backbone model or collection item
         * into a plain JavaScript object.
         */
        toPlainObject: function (item) {

            if (!item) {
                return {};
            }

            if (typeof item.toJSON === 'function') {
                return item.toJSON();
            }

            return Object.assign({}, item);

        },

        /**
         * Find the Elementor preview documents.
         */
        getDocuments: function () {

            const documents = [];

            const iframe = document.getElementById(
                'elementor-preview-iframe'
            );

            if (iframe) {

                try {

                    if (
                        iframe.contentDocument &&
                        iframe.contentDocument.readyState !== 'loading'
                    ) {
                        documents.push(iframe.contentDocument);
                    }

                } catch (error) {

                    console.warn(
                        'OIS: Could not access Elementor preview.',
                        error
                    );

                }

            }

            documents.push(document);

            return documents;

        },

        /**
         * Find the native Elementor Icon List
         * matching the Connection ID.
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

                    const elementConnection = (
                        element.getAttribute('data-offer-stack') || ''
                    ).trim();

                    if (elementConnection !== connectionId) {
                        continue;
                    }

                    /*
                     * Support the attribute being applied
                     * directly to the list or its parent widget.
                     */
                    if (
                        element.matches('.elementor-icon-list-items')
                    ) {
                        return element;
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
         * Read every native Icon List item.
         *
         * Blank labels receive a fallback name so that
         * the number of generated entries always matches
         * the number of Icon List items.
         */
        getLabels: function (list) {

            if (!list) {
                return [];
            }

            const items = Array.from(
                list.querySelectorAll(
                    '.elementor-icon-list-item'
                )
            );

            return items.map(function (item, index) {

                const textElement = item.querySelector(
                    '.elementor-icon-list-text'
                );

                const label = textElement
                    ? textElement.textContent
                        .replace(/\s+/g, ' ')
                        .trim()
                    : '';

                return label || 'Item ' + (index + 1);

            });

        },

        /**
         * Read existing Image Stack repeater entries.
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

                return OIS.toPlainObject(offer);

            });

        },

        /**
         * Match existing images against Icon List labels.
         *
         * Matching images are preserved.
         * New labels receive empty image placeholders.
         * Duplicate labels are handled independently.
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
                 * Preserve an existing matching entry.
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
                 * Create a new image entry.
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
         * Display an Elementor notification.
         */
        notify: function (message, type) {

            const editor = window.elementor;

            if (
                editor &&
                editor.notifications &&
                typeof editor.notifications.showToast === 'function'
            ) {

                editor.notifications.showToast({

                    message: message,

                    type: type || 'info'

                });

            } else {

                window.alert(message);

            }

        },

        /**
         * Update the Elementor widget model.
         */
        updateWidget: function (model, offers) {

            const settings = model.get('settings');

            if (!settings) {
                throw new Error(
                    'Widget settings are unavailable.'
                );
            }

            if (typeof model.setSetting === 'function') {

                model.setSetting(
                    'offers',
                    offers
                );

            } else if (typeof settings.set === 'function') {

                settings.set(
                    'offers',
                    offers
                );

            } else {

                throw new Error(
                    'Unable to update the Image Stack repeater.'
                );

            }

        },

        /**
         * Perform Icon List synchronisation.
         */
        sync: function () {

            if (this.syncing) {
                return;
            }

            const model = this.activeModel;

            if (!model) {

                this.notify(
                    'Offer Image Stack was not detected. Close and reopen its settings panel.',
                    'danger'
                );

                console.error(
                    'OIS: No active widget model.'
                );

                return;

            }

            try {

                const settings = model.get('settings');

                if (!settings) {

                    throw new Error(
                        'Unable to read widget settings.'
                    );

                }

                const connectionId = String(
                    settings.get('connection_id') || ''
                ).trim();

                if (!connectionId) {

                    this.notify(
                        'Please enter a Connection ID first.',
                        'warning'
                    );

                    return;

                }

                /*
                 * Find the connected native Icon List.
                 */
                const list = this.findConnectedList(
                    connectionId
                );

                if (!list) {

                    this.notify(
                        'Icon List not found. Check Advanced → Attributes and make sure data-offer-stack|' +
                        connectionId +
                        ' matches the Connection ID.',
                        'danger'
                    );

                    console.error(
                        'OIS: Connected Icon List not found.',
                        connectionId
                    );

                    return;

                }

                /*
                 * Read all Icon List labels.
                 */
                const labels = this.getLabels(list);

                if (!labels.length) {

                    this.notify(
                        'The connected Icon List contains no items.',
                        'warning'
                    );

                    return;

                }

                this.syncing = true;

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
                 * Update the Elementor repeater.
                 */
                this.updateWidget(
                    model,
                    syncedOffers
                );

                console.log(
                    'OIS: Synchronisation successful.',
                    {
                        connectionId: connectionId,
                        iconListCount: labels.length,
                        previousImageCount: existingOffers.length,
                        newImageCount: syncedOffers.length,
                        labels: labels,
                        offers: syncedOffers
                    }
                );

                this.notify(
                    'Successfully synced ' +
                    syncedOffers.length +
                    ' images from your Icon List. Matching uploaded images have been preserved.',
                    'success'
                );

            } catch (error) {

                console.error(
                    'OIS: Synchronisation failed.',
                    error
                );

                this.notify(
                    'Sync failed: ' + error.message,
                    'danger'
                );

            } finally {

                this.syncing = false;

            }

        },

        /**
         * Register Elementor editor integration.
         */
        init: function () {

            if (this.initialized) {
                return;
            }

            const editor = window.elementor;

            if (
                !editor ||
                !editor.channels ||
                !editor.channels.editor ||
                !editor.hooks ||
                typeof editor.hooks.addAction !== 'function'
            ) {

                console.warn(
                    'OIS: Elementor editor API is not ready yet.'
                );

                return;

            }

            /*
             * Prevent duplicate event registrations.
             */
            this.initialized = true;

            /*
             * Remember the active Image Stack widget.
             */
            editor.hooks.addAction(
                'panel/open_editor/widget/offer-image-stack',
                function (panel, model) {

                    if (
                        !model ||
                        typeof model.get !== 'function'
                    ) {

                        console.error(
                            'OIS: Invalid widget model received.'
                        );

                        return;

                    }

                    OIS.activeModel = model;

                    console.log(
                        'OIS: Offer Image Stack selected.',
                        model
                    );

                }
            );

            /*
             * Listen for the PHP Sync button event.
             */
            editor.channels.editor.on(
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
     * Initialise when Elementor is ready.
     *
     * The event listener handles normal loading.
     * The immediate call handles cases where Elementor
     * has already initialised before this script loads.
     */

    function initOIS() {

        OIS.init();

    }

    /*
     * Listen for Elementor initialisation.
     */
    $(window).on(
        'elementor:init.ois elementor:loaded.ois',
        initOIS
    );

    /*
     * Also attempt immediate initialisation.
     */
    initOIS();


})(jQuery);
