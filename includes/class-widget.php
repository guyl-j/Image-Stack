
<?php
/**
 * Offer Image Stack - Integrated Icon List Widget
 * Version: 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once __DIR__ . '/class-icon-list.php';

class Offer_Image_Stack_Widget extends \Elementor\Widget_Base {

    use OIS_Icon_List_Controls;

    public function get_name() {
        return 'offer-image-stack';
    }

    public function get_title() {
        return 'Image Stack List';
    }

    public function get_icon() {
        return 'eicon-gallery-grid';
    }

    public function get_categories() {
        return [ 'general' ];
    }

    public function get_keywords() {
        return [
            'image',
            'stack',
            'icon',
            'list',
            'hover',
            'gallery',
        ];
    }

    public function get_style_depends() {
        return [ 'offer-image-stack' ];
    }

    public function get_script_depends() {
        return [ 'offer-image-stack' ];
    }

    protected function register_controls() {

        // Integrated Icon List controls.
        $this->register_icon_list_controls();

        /*
         * STACK POSITION
         */

        $this->start_controls_section(
            'section_stack_position',
            [
                'label' => 'Stack Position',
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $position_options = [
            'row' => 'Left of List',
            'row-reverse' => 'Right of List',
            'column' => 'Above List',
            'column-reverse' => 'Below List',
        ];

        $this->add_responsive_control(
            'stack_position',
            [
                'label' => 'Stack Position',
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'row',
                'options' => $position_options,
                'description' =>
                    'Choose independently for desktop, tablet and mobile. Left and right create an inline layout.',
                'selectors' => [
                    '{{WRAPPER}} .ois-layout' =>
                        'flex-direction: {{VALUE}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'stack_list_gap',
            [
                'label' => 'Stack / List Spacing',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', 'em', '%' ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 200,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 40,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-layout' =>
                        'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'stack_vertical_alignment',
            [
                'label' => 'Vertical Alignment',
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'flex-start' => [
                        'title' => 'Top',
                        'icon' => 'eicon-v-align-top',
                    ],
                    'center' => [
                        'title' => 'Middle',
                        'icon' => 'eicon-v-align-middle',
                    ],
                    'flex-end' => [
                        'title' => 'Bottom',
                        'icon' => 'eicon-v-align-bottom',
                    ],
                ],
                'default' => 'center',
                'selectors' => [
                    '{{WRAPPER}} .ois-layout' =>
                        'align-items: {{VALUE}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_width',
            [
                'label' => 'List Width',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%' ],
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 800,
                    ],
                    '%' => [
                        'min' => 10,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => '%',
                    'size' => 50,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-list-area' =>
                        'width: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();

        /*
         * IMAGE STACK
         */

        $this->start_controls_section(
            'section_images',
            [
                'label' => 'Image Stack',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_responsive_control(
            'card_width',
            [
                'label' => 'Image Width',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%' ],
                'range' => [
                    'px' => [
                        'min' => 80,
                        'max' => 600,
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
                'label' => 'Image Height',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px' ],
                'range' => [
                    'px' => [
                        'min' => 100,
                        'max' => 700,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 280,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-card' =>
                        'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .ois-stage' =>
                        '--ois-card-height: {{SIZE}}{{UNIT}};',
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
                'label' => 'Image Overlap',
                'type' => \Elementor\Controls_Manager::SLIDER,
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
         * IMAGE STYLE
         */

        $this->start_controls_section(
            'section_image_style',
            [
                'label' => 'Image Styling',
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
                        'max' => 100,
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

        $items = $settings['list_items'] ?? [];

        if ( empty( $items ) ) {

            if (
                \Elementor\Plugin::$instance->editor->is_edit_mode()
            ) {
                echo '<div class="ois-editor-notice">';
                echo esc_html(
                    'Add Icon List items and associated images to get started.'
                );
                echo '</div>';
            }

            return;
        }

        $id = 'ois-' . $this->get_id();

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

        $offset *= $density_multiplier[ $density ] ?? 0.55;

        $images = [];

        foreach ( $items as $index => $item ) {

            if (
                ! empty( $item['item_image']['url'] )
            ) {
                $images[] = [
                    'index' => $index,
                    'url' => $item['item_image']['url'],
                    'alt' => ! empty( $item['item_alt'] )
                        ? $item['item_alt']
                        : ( $item['item_image']['alt'] ?? '' ),
                    'title' => $item['item_text'] ?? '',
                ];
            }
        }

        if ( empty( $images ) ) {

            if (
                \Elementor\Plugin::$instance->editor->is_edit_mode()
            ) {
                echo '<div class="ois-editor-notice">';
                echo esc_html(
                    'Add at least one associated image to your Icon List.'
                );
                echo '</div>';
            }

            return;
        }

        $icon_position = $settings['icon_position'] ?? 'start';
        $list_layout = $settings['list_layout'] ?? 'vertical';

        ?>

        <div
            id="<?php echo esc_attr( $id ); ?>"
            class="offer-image-stack ois-integrated"
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

            <div class="ois-layout">

                <div class="ois-image-area">

                    <div class="ois-stage">

                        <?php foreach ( $images as $image ) : ?>

                            <div
                                class="ois-card"
                                data-offer-index="<?php echo esc_attr( $image['index'] ); ?>"
                                aria-hidden="true"
                            >

                                <img
                                    src="<?php echo esc_url( $image['url'] ); ?>"
                                    alt="<?php echo esc_attr( $image['alt'] ); ?>"
                                    loading="lazy"
                                />

                            </div>

                        <?php endforeach; ?>

                    </div>

                </div>

                <div class="ois-list-area">

                    <?php
                    $this->render_icon_list(
                        $items,
                        $icon_position,
                        $list_layout
                    );
                    ?>

                </div>

            </div>

        </div>

        <?php
    }
}
