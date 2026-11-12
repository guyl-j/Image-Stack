
/**
 * Offer Image Stack
 * Elementor Editor Integration
 * Version: 2.3.0
 */

(function ($) {

    'use strict';

    const OIS = {

        activeModel: null,
        syncing: false,
        initialized: false,

        normaliseText: function (text) {

            return String(text || '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

        },

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
         * Find Elementor preview documents.
         */
        getDocuments: function () {

            const documents = [];

            const iframe = document.getElementById(
                'elementor-preview-iframe'
            );

            if (iframe) {

                try {

                    if (iframe.contentDocument) {
                        documents.push(iframe.contentDocument);
                    }

                } catch (error) {

                    console.warn(
                        'OIS: Could not access preview iframe.',
                        error
                    );

                }

            }

            documents.push(document);

            return [...new Set(documents)];

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

                if (!doc || !doc.querySelectorAll) {
                    continue;
                }

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

                    if (
                        element.matches('.elementor-icon-list-items')
                    ) {
                        return element;
                    }

                    if (
                        element.matches('.elementor-widget-icon-list')
                    ) {

                        const list = element.querySelector(
                            '.elementor-icon-list-items'
                        );

                        if (list) {
                            return list;
                        }

                    }

                    const nestedList = element.querySelector(
                        '.elementor-icon-list-items'
                    );

                    if (nestedList) {
                        return nestedList;
                    }

                }

                const iconWidgets = doc.querySelectorAll(
                    '.elementor-widget-icon-list'
                );

                for (const widget of iconWidgets) {

                    const attribute = (
                        widget.getAttribute('data-offer-stack') || ''
                    ).trim();

                    if (attribute !== connectionId) {
                        continue;
                    }

                    const list = widget.querySelector(
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
         * Diagnose failed Icon List lookup.
         */
        diagnoseLookup: function (connectionId) {

            console.group(
                'OIS: Icon List lookup diagnostic'
            );

            console.log(
                'Expected Connection ID:',
                connectionId
            );

            this.getDocuments().forEach(function (doc, index) {

                console.group('Document ' + index);

                console.log(
                    'URL:',
                    doc.location ? doc.location.href : 'Unknown'
                );

                console.log(
                    'Elements with data-offer-stack:',
                    Array.from(
                        doc.querySelectorAll('[data-offer-stack]')
                    ).map(function (element) {

                        return {
                            tag: element.tagName,
                            className: element.className,
                            connection: element.getAttribute(
                                'data-offer-stack'
                            )
                        };

                    })
                );

                console.log(
                    'Icon List widgets:',
                    doc.querySelectorAll(
                        '.elementor-widget-icon-list'
                    ).length
                );

                console.log(
                    'Icon List containers:',
                    doc.querySelectorAll(
                        '.elementor-icon-list-items'
                    ).length
                );

                console.groupEnd();

            });

            console.groupEnd();

        },

        /**
         * Read Icon List labels.
         */
        getLabels: function (list) {

            if (!list) {
                return [];
            }

            const items = Array.from(
                list.querySelectorAll(
                    ':scope > .elementor-icon-list-item'
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
         * Read existing image entries.
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
         * Match existing images against labels.
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

                if (matches && matches.length) {

                    const existing = matches.shift();

                    return Object.assign({}, existing, {

                        offer_name: label,
                        image_alt: label,
                        label_key: key

                    });

                }

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
         * Update Elementor widget model.
         */
        updateWidget: function (model, offers) {

            const settings = model.get('settings');

            if (!settings) {
                throw new Error(
                    'Widget settings are unavailable.'
                );
            }

            if (typeof model.setSetting === 'function') {

                model.setSetting('offers', offers);

            } else if (typeof settings.set === 'function') {

                settings.set('offers', offers);

            } else {

                throw new Error(
                    'Unable to update the Image Stack repeater.'
                );

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
                    'Offer Image Stack was not detected. Close and reopen its settings panel.',
                    'danger'
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

                console.log(
                    'OIS: Looking for Icon List:',
                    connectionId
                );

                const list = this.findConnectedList(
                    connectionId
                );

                if (!list) {

                    this.diagnoseLookup(connectionId);

                    this.notify(
                        'Icon List not found. Check the browser console (F12) for diagnostics.',
                        'danger'
                    );

                    return;

                }

                const labels = this.getLabels(list);

                console.log(
                    'OIS: Detected labels:',
                    labels
                );

                if (!labels.length) {

                    this.notify(
                        'The connected Icon List contains no items.',
                        'warning'
                    );

                    return;

                }

                this.syncing = true;

                const existingOffers = this.getExistingOffers(
                    model
                );

                const syncedOffers = this.synchroniseOffers(
                    labels,
                    existingOffers
                );

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
                    ' images. Matching uploaded images have been preserved.',
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

            this.initialized = true;

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
     * Initialise Elementor integration.
     */
    function initOIS() {

        OIS.init();

    }

    $(window).on(
        'elementor:init.ois elementor:loaded.ois',
        initOIS
    );

    initOIS();

})(jQuery);
