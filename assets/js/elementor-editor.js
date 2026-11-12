/**
 * Offer Image Stack
 * Elementor Editor Integration
 * Version: 2.5.1
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

            if (!item) return {};

            if (typeof item.toJSON === 'function') {
                return item.toJSON();
            }

            return Object.assign({}, item);

        },

        getSettings: function (model) {

            if (!model || typeof model.get !== 'function') {
                return {};
            }

            return this.toPlainObject(
                model.get('settings')
            );

        },

        getConnectionId: function (attributes) {

            if (!attributes) return null;

            if (typeof attributes !== 'string') {

                if (typeof attributes.toJSON === 'function') {
                    attributes = attributes.toJSON();
                }

                if (typeof attributes !== 'string') {
                    return null;
                }

            }

            const lines = attributes.split(/\r?\n/);

            for (const line of lines) {

                const parts = line.trim().split('|');

                if (
                    parts.length >= 2 &&
                    parts[0].trim() === 'data-offer-stack'
                ) {
                    return parts.slice(1).join('|').trim();
                }

            }

            return null;

        },

        getEditorDocuments: function () {

            const documents = [];
            const editor = window.elementor;

            const roots = editor?.elements?.models || [];

            if (roots.length) {

                documents.push({
                    id: 'main',
                    models: roots
                });

            }

            const registered =
                editor?.documents?.documents || {};

            Object.keys(registered).forEach(function (key) {

                const entry = registered[key];

                const doc =
                    entry?.getCurrentPageView?.() ||
                    entry?.container ||
                    entry;

                const elements =
                    doc?.model?.get?.('elements') ||
                    doc?.elements ||
                    doc?.model?.elements;

                if (elements?.models) {

                    documents.push({
                        id: key,
                        models: elements.models
                    });

                }

            });

            return documents;

        },

        getEditorIconLists: function () {

            const documents = this.getEditorDocuments();

            const results = [];
            const visited = new Set();

            function inspect(models, documentId) {

                if (!models) return;

                models.forEach(function (model) {

                    if (!model || visited.has(model)) return;

                    visited.add(model);

                    const widgetType = model.get?.('widgetType');

                    if (widgetType === 'icon-list') {

                        const settings = OIS.getSettings(model);

                        results.push({

                            id: model.get('id'),
                            model: model,
                            documentId: documentId,
                            settings: settings,

                            connectionId: OIS.getConnectionId(
                                settings._attributes
                            ),

                            items: settings.icon_list || []

                        });

                    }

                    const children = model.get?.('elements');

                    if (children?.models) {
                        inspect(children.models, documentId);
                    }

                });

            }

            documents.forEach(function (entry) {

                inspect(entry.models, entry.id);

            });

            return results;

        },

        getPreviewDocuments: function () {

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
                        'OIS: Preview iframe unavailable.',
                        error
                    );

                }

            }

            documents.push(document);

            return [...new Set(documents)];

        },

        getPreviewIconLists: function () {

            const results = [];

            this.getPreviewDocuments().forEach(function (doc) {

                if (!doc?.querySelectorAll) return;

                const widgets = doc.querySelectorAll(
                    '.elementor-widget-icon-list'
                );

                widgets.forEach(function (widget) {

                    const list = widget.querySelector(
                        '.elementor-icon-list-items'
                    );

                    results.push({

                        id: widget.dataset.id || null,
                        element: widget,
                        list: list,

                        connectionId: widget.getAttribute(
                            'data-offer-stack'
                        ),

                        document: doc

                    });

                });

            });

            return results;

        },

        findEditorIconList: function (connectionId) {

            if (!connectionId) return null;

            return this.getEditorIconLists().find(
                function (list) {
                    return list.connectionId === connectionId;
                }
            ) || null;

        },

        findPreviewIconList: function (connectionId) {

            if (!connectionId) return null;

            return this.getPreviewIconLists().find(
                function (list) {
                    return list.connectionId === connectionId;
                }
            ) || null;

        },

        getModelLabels: function (editorList) {

            if (!editorList || !editorList.items) {
                return [];
            }

            return editorList.items.map(function (item, index) {

                const label = String(
                    item.text || ''
                ).replace(/\s+/g, ' ').trim();

                return label || 'Item ' + (index + 1);

            });

        },

        getPreviewLabels: function (previewList) {

            if (!previewList || !previewList.list) {
                return [];
            }

            return Array.from(
                previewList.list.querySelectorAll(
                    ':scope > .elementor-icon-list-item'
                )
            ).map(function (item, index) {

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

        diagnoseIconLists: function () {

            const editorLists = this.getEditorIconLists();

            const previewLists = this.getPreviewIconLists();

            console.group(
                'OIS: Icon List discovery diagnostic'
            );

            console.log(
                'Editor Icon Lists:',
                editorLists.length
            );

            console.log(
                'Preview Icon Lists:',
                previewLists.length
            );

            console.table(
                editorLists.map(function (item) {

                    return {
                        id: item.id,
                        document: item.documentId,
                        connectionID: item.connectionId,
                        itemCount: item.items.length
                    };

                })
            );

            console.table(
                previewLists.map(function (item) {

                    return {
                        previewID: item.id,
                        previewConnection: item.connectionId,
                        renderedListFound: !!item.list
                    };

                })
            );

            console.groupEnd();

            return {
                editorLists: editorLists,
                previewLists: previewLists
            };

        },
		
		        getExistingOffers: function (model) {

            const settings = model.get('settings');

            if (!settings) return [];

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

        synchroniseOffers: function (labels, existingOffers) {

            const lookup = new Map();

            existingOffers.forEach(function (offer) {

                const key = OIS.normaliseText(
                    offer.offer_name || ''
                );

                if (!key) return;

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

        sync: function () {

            if (this.syncing) return;

            const model = this.activeModel;

            if (!model) {

                this.notify(
                    'Offer Image Stack was not detected. Close and reopen its settings panel.',
                    'danger'
                );

                return;

            }

            this.syncing = true;

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

                const editorList = this.findEditorIconList(
                    connectionId
                );

                const previewList = this.findPreviewIconList(
                    connectionId
                );

                let labels = [];

                if (editorList) {
                    labels = this.getModelLabels(editorList);
                }

                if (!labels.length && previewList) {
                    labels = this.getPreviewLabels(previewList);
                }

                if (!labels.length) {

                    this.diagnoseIconLists();

                    this.notify(
                        'Connected Icon List not found or contains no items. Check the Connection ID and data-offer-stack attribute.',
                        'danger'
                    );

                    return;

                }

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
                        editorModelFound: !!editorList,
                        previewWidgetID: previewList?.id || null,
                        previousImageCount: existingOffers.length,
                        newImageCount: syncedOffers.length,
                        labels: labels,
                        offers: syncedOffers
                    }
                );

                this.notify(
                    'Successfully synced ' +
                    syncedOffers.length +
                    ' offers. Matching uploaded images have been preserved.',
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
		
		        init: function () {

            if (this.initialized) return;

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

            editor.hooks.addAction(
                'panel/open_editor',
                function (panel, model) {

                    if (
                        model &&
                        model.get &&
                        model.get('widgetType') !== 'offer-image-stack'
                    ) {

                        OIS.activeModel = null;

                    }

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
                'OIS: Elementor editor integration loaded.',
                'Version 2.5.1'
            );

        }

    };


    function initOIS() {
        OIS.init();
    }


    $(window).on(
        'elementor:init.ois elementor:loaded.ois',
        initOIS
    );


    initOIS();


    window.OIS = OIS;


})(jQuery);
