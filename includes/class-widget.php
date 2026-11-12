<?php
/**
 * Offer Image Stack - Elementor Widget
 * Version: 2.5.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Offer_Image_Stack_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'offer-image-stack';
    }

    public function get_title() {
        return 'Offer Image Stack';
    }

    public function get_icon() {
        return 'eicon-gallery-grid';
    }

    public function get_categories() {
        return [ 'general' ];
    }

    public function get_keywords() {
        return [
            'offer',
            'image',
            'stack',
            'overlap',
            'gallery',
            'icon list',
        ];
    }

    public function get_style_depends() {
        return [ 'offer-image-stack' ];
    }

    public function get_script_depends() {
        return [ 'offer-image-stack' ];
    }

    protected function register_controls() {

        /*
         * CONNECTION
         */

        $this->start_controls_section(
            'section_connection',
            [
                'label' => 'Icon List Connection',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'connection_id',
            [
                'label' => 'Connection ID',
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => 'offers-01',
                'placeholder' => 'offers-01',
                'description' => 'Must match the data-offer-stack attribute on your native Elementor Icon List.',
            ]
        );

        $this->add_control(
            'connection_help',
            [
                'type' => \Elementor\Controls_Manager::RAW_HTML,
                'raw' => '
                    <strong>How to connect:</strong><br>
                    Select your native Elementor Icon List.<br>
                    Go to Advanced → Attributes.<br>
                    Add:<br>
                    <code>data-offer-stack|offers-01</code>
                    <br><br>
                    Make sure the Connection ID above matches.
                ',
                'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
            ]
        );

        $this->end_controls_section();


        /*
         * OFFER IMAGES
         */

        $this->start_controls_section(
            'section_images',
            [
                'label' => 'Offer Images',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        /*
         * Sync button.
         */

        $this->add_control(
            'sync_icon_list',
            [
                'label' => 'Sync Images',
                'type' => \Elementor\Controls_Manager::BUTTON,
                'text' => 'Sync with Icon List',
                'event' => 'ois:sync-icon-list',
                'button_type' => 'default',
                'separator' => 'before',
            ]
        );

        $this->add_control(
            'sync_help',
            [
                'type' => \Elementor\Controls_Manager::RAW_HTML,
                'raw' => '
                    <div style="padding:10px;background:#f1f5f9;border-radius:5px;">
                        Click Sync with Icon List to create one image
                        entry for every Icon List item.

                        Existing images are preserved when their
                        matching text remains unchanged.
                    </div>
                ',
            ]
        );

        /*
         * Repeater fields.
         */

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'offer_name',
            [
                'label' => 'Offer Name',
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => '',
                'label_block' => true,
            ]
        );

        $repeater->add_control(
            'offer_image',
            [
                'label' => 'Offer Image',
                'type' => \Elementor\Controls_Manager::MEDIA,
                'default' => [],
            ]
        );

        $repeater->add_control(
            'image_alt',
            [
                'label' => 'Image Alt Text',
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => '',
                'label_block' => true,
            ]
        );

        $repeater->add_control(
            'label_key',
            [
                'type' => \Elementor\Controls_Manager::HIDDEN,
                'default' => '',
            ]
        );

        $this->add_control(
            'offers',
            [
                'label' => 'Images',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'title_field' => '{{{ offer_name }}}',
                'default' => [],
            ]
        );

        $this->end_controls_section();


        /*
         * STACK LAYOUT
         */

        $this->start_controls_section(
            'section_layout',
            [
                'label' => 'Stack Layout',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_responsive_control(
            'card_width',
            [
                'label' => 'Card Width',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%' ],
                'range' => [
                    'px' => [
                        'min' => 80,
                        'max' => 500,
                    ],
                    '%' => [
                        'min' => 10,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 220,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-card' =>
                        'width: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'card_height',
            [
                'label' => 'Card Height',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px' ],
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 600,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 280,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-card' =>
                        'height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'rotation',
            [
                'label' => 'Maximum Rotation',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 35,
                    ],
                ],
                'default' => [
                    'size' => 15,
                ],
            ]
        );

        $this->add_control(
            'offset',
            [
                'label' => 'Maximum Position Offset',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'description' => 'Controls how tightly the images overlap.',
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'size' => 25,
                ],
            ]
        );

        $this->add_control(
            'pile_density',
            [
                'label' => 'Pile Density',
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'compact',
                'options' => [
                    'compact' => 'Compact',
                    'medium' => 'Medium',
                    'loose' => 'Loose',
                ],
            ]
        );

        $this->end_controls_section();


        /*
         * ANIMATION
         */

        $this->start_controls_section(
            'section_animation',
            [
                'label' => 'Animation',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'hover_scale',
            [
                'label' => 'Active Image Scale (%)',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 140,
                    ],
                ],
                'default' => [
                    'size' => 108,
                ],
            ]
        );

        $this->add_control(
            'hover_lift',
            [
                'label' => 'Active Image Lift',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'size' => 20,
                ],
            ]
        );

        $this->add_control(
            'animation_speed',
            [
                'label' => 'Animation Speed (ms)',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 1500,
                    ],
                ],
                'default' => [
                    'size' => 450,
                ],
            ]
        );

        $this->end_controls_section();


        /*
         * STYLE
         */

        $this->start_controls_section(
            'section_style',
            [
                'label' => 'Card Styling',
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'border_radius',
            [
                'label' => 'Border Radius',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 50,
                    ],
                ],
                'default' => [
                    'size' => 8,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-card img' =>
                        'border-radius: {{SIZE}}px;',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Box_Shadow::get_type(),
            [
                'name' => 'card_shadow',
                'selector' => '{{WRAPPER}} .ois-card img',
            ]
        );

        $this->end_controls_section();
    }


    /**
     * Render widget.
     */

    protected function render() {

        $settings = $this->get_settings_for_display();

        $offers = $settings['offers'] ?? [];

        $offers = array_values(
            array_filter(
                $offers,
                function ( $offer ) {
                    return ! empty( $offer['offer_image']['url'] );
                }
            )
        );

        if ( empty( $offers ) ) {

            if (
                \Elementor\Plugin::$instance->editor->is_edit_mode()
            ) {

                echo '<div class="ois-editor-notice">';
                echo esc_html(
                    'Sync your Icon List and add offer images to display your image stack.'
                );
                echo '</div>';

            }

            return;
        }

        $id = 'ois-' . $this->get_id();

        $connection_id = Offer_Image_Stack_Connector::sanitize_connection_id(
            $settings['connection_id'] ?? ''
        );

        $rotation = absint(
            $settings['rotation']['size'] ?? 15
        );

        $offset = absint(
            $settings['offset']['size'] ?? 25
        );

        $scale = absint(
            $settings['hover_scale']['size'] ?? 108
        );

        $lift = absint(
            $settings['hover_lift']['size'] ?? 20
        );

        $speed = absint(
            $settings['animation_speed']['size'] ?? 450
        );

        $density = $settings['pile_density'] ?? 'compact';

        $density_multiplier = [
            'compact' => 0.55,
            'medium' => 0.8,
            'loose' => 1,
        ];

        $offset = $offset * (
            $density_multiplier[ $density ] ?? 0.55
        );

        ?>

        <div
            id="<?php echo esc_attr( $id ); ?>"
            class="offer-image-stack"
            data-connection="<?php echo esc_attr( $connection_id ); ?>"
            data-rotation="<?php echo esc_attr( $rotation ); ?>"
            data-offset="<?php echo esc_attr( $offset ); ?>"
            data-scale="<?php echo esc_attr( $scale / 100 ); ?>"
            data-lift="<?php echo esc_attr( $lift ); ?>"
            data-speed="<?php echo esc_attr( $speed ); ?>"
            style="
                --ois-speed: <?php echo esc_attr( $speed ); ?>ms;
                --ois-scale: <?php echo esc_attr( $scale / 100 ); ?>;
                --ois-lift: <?php echo esc_attr( $lift ); ?>px;
            "
        >

            <div class="ois-stage">

                <?php foreach ( $offers as $index => $offer ) :

                    $image = $offer['offer_image'];

                    $image_url = $image['url'];

                    $alt = ! empty( $offer['image_alt'] )
                        ? $offer['image_alt']
                        : ( $image['alt'] ?? 'Offer image' );

                    ?>

                    <div
                        class="ois-card"
                        data-offer-index="<?php echo esc_attr( $index ); ?>"
                        data-offer-name="<?php echo esc_attr( $offer['offer_name'] ?? '' ); ?>"
                        aria-hidden="true"
                    >

                        <img
                            src="<?php echo esc_url( $image_url ); ?>"
                            alt="<?php echo esc_attr( $alt ); ?>"
                            loading="lazy"
                        />

                    </div>

                <?php endforeach; ?>

            </div>

        </div>

        <?php
    }
}
