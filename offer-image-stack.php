<?php
/**
 * Plugin Name: Offer Image Stack for Elementor
 * Description: Interactive overlapping offer image stack connected to Elementor's native Icon List.
 * Version: 2.5.4
 * Author: Framework Web
 * Text Domain: offer-image-stack
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Plugin constants.
 */
define( 'OIS_VERSION', '2.5.4' );
define( 'OIS_PATH', plugin_dir_path( __FILE__ ) );
define( 'OIS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register frontend assets.
 */
function ois_register_frontend_assets() {

    wp_register_style(
        'offer-image-stack',
        OIS_URL . 'assets/css/offer-image-stack.css',
        array(),
        OIS_VERSION
    );

    wp_register_script(
        'offer-image-stack',
        OIS_URL . 'assets/js/offer-image-stack.js',
        array(),
        OIS_VERSION,
        true
    );
}

add_action(
    'wp_enqueue_scripts',
    'ois_register_frontend_assets'
);

/**
 * Register Elementor editor assets.
 */
function ois_register_editor_assets() {

    wp_enqueue_script(
        'offer-image-stack-editor',
        OIS_URL . 'assets/js/elementor-editor.js',
        array(
            'jquery',
            'elementor-editor',
        ),
        OIS_VERSION,
        true
    );
}

add_action(
    'elementor/editor/after_enqueue_scripts',
    'ois_register_editor_assets'
);

/**
 * Load Elementor-dependent plugin files.
 */
function ois_init_elementor_widget() {

    if ( ! did_action( 'elementor/loaded' ) ) {
        return;
    }

    if ( ! class_exists( '\Elementor\Widget_Base' ) ) {
        return;
    }

    require_once OIS_PATH . 'includes/class-icon-list-connector.php';

    require_once OIS_PATH . 'includes/class-widget.php';

    add_action(
        'elementor/widgets/register',
        'ois_register_offer_image_stack_widget'
    );
}

add_action(
    'elementor/init',
    'ois_init_elementor_widget',
    20
);

/**
 * Register Offer Image Stack widget.
 */
function ois_register_offer_image_stack_widget( $widgets_manager ) {

    if ( ! class_exists( 'Offer_Image_Stack_Widget' ) ) {
        return;
    }

    $widgets_manager->register(
        new \Offer_Image_Stack_Widget()
    );
}
