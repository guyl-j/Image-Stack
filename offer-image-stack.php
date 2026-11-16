
<?php
/**
 * Plugin Name: Offer Image Stack
 * Description: Interactive Elementor Image Stack and Icon List widget.
 * Version: 3.0.0
 * Author: Framework Web
 * Text Domain: offer-image-stack
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'OIS_VERSION', '3.0.0' );
define( 'OIS_PATH', plugin_dir_path( __FILE__ ) );
define( 'OIS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register widget assets.
 */
function ois_register_assets() {

    wp_register_style(
        'offer-image-stack',
        OIS_URL . 'assets/css/offer-image-stack.css',
        [],
        OIS_VERSION
    );

    wp_register_style(
        'offer-image-stack-responsive',
        OIS_URL . 'assets/css/offer-image-stack-responsive.css',
        [ 'offer-image-stack' ],
        OIS_VERSION
    );

    wp_register_script(
        'offer-image-stack',
        OIS_URL . 'assets/js/offer-image-stack.js',
        [ 'jquery', 'elementor-frontend' ],
        OIS_VERSION,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ois_register_assets' );

/**
 * Register Elementor widget.
 */
function ois_register_elementor_widget( $widgets_manager ) {

    require_once OIS_PATH . 'includes/class-widget.php';

    $widgets_manager->register(
        new \Offer_Image_Stack_Widget()
    );
}
add_action(
    'elementor/widgets/register',
    'ois_register_elementor_widget'
);

/**
 * Declare Elementor compatibility.
 */
function ois_elementor_compatibility() {

    if ( class_exists( '\Elementor\Plugin' ) ) {

        \Elementor\Plugin::$instance->files_manager
            ->clear_cache();
    }
}
add_action( 'elementor/init', 'ois_elementor_compatibility' );
