<?php
/**
 * Offer Image Stack - Icon List Connector
 * Version: 2.5.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Offer_Image_Stack_Connector {

    /**
     * Connection attribute used on native Elementor Icon Lists.
     */
    const ATTRIBUTE = 'data-offer-stack';

    /**
     * Return the connection attribute name.
     */
    public static function get_attribute_name() {

        return self::ATTRIBUTE;
    }

    /**
     * Sanitize a connection ID.
     */
    public static function sanitize_connection_id( $connection_id ) {

        return sanitize_key( $connection_id );
    }

    /**
     * Return frontend connection information.
     */
    public static function get_connection_data( $connection_id ) {

        return array(
            'connection_id' => self::sanitize_connection_id(
                $connection_id
            ),
            'attribute' => self::ATTRIBUTE,
        );
    }

    /**
     * Normalize an Icon List label.
     *
     * Used when matching existing image entries
     * with newly synchronized Icon List items.
     */
    public static function normalize_label( $label ) {

        $label = wp_strip_all_tags( $label );

        $label = html_entity_decode(
            $label,
            ENT_QUOTES,
            get_bloginfo( 'charset' )
        );

        $label = trim(
            preg_replace( '/\s+/', ' ', $label )
        );

        return sanitize_text_field( $label );
    }

    /**
     * Generate a stable matching key for a label.
     */
    public static function get_label_key( $label ) {

        $label = self::normalize_label( $label );

        return md5(
            strtolower( $label )
        );
    }

    /**
     * Prepare an Icon List label for an image entry.
     */
    public static function prepare_offer_data( $label ) {

        $label = self::normalize_label( $label );

        return array(
            'image_alt'  => $label,
            'offer_name' => $label,
            'label_key'  => self::get_label_key( $label ),
        );
    }

}
