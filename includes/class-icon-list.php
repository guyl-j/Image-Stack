
<?php
/**
 * Integrated Icon List controls for Offer Image Stack.
 * Each list item owns its icon, text, link and image.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

trait OIS_Icon_List_Controls {

    protected function register_icon_list_controls() {

        $this->start_controls_section(
            'section_icon_list',
            [
                'label' => 'Icon List',
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'item_text',
            [
                'label'       => 'List Text',
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => 'List Item',
                'label_block' => true,
                'dynamic'     => [ 'active' => true ],
            ]
        );

        $repeater->add_control(
            'item_icon',
            [
                'label'   => 'Icon',
                'type'    => \Elementor\Controls_Manager::ICONS,
                'default' => [
                    'value'   => 'fas fa-check',
                    'library' => 'fa-solid',
                ],
            ]
        );

        $repeater->add_control(
            'item_link',
            [
                'label'         => 'Link',
                'type'          => \Elementor\Controls_Manager::URL,
                'placeholder'   => 'https://your-link.com',
                'options'       => [ 'url', 'is_external', 'nofollow' ],
                'default'       => [
                    'url'         => '',
                    'is_external' => false,
                    'nofollow'    => false,
                ],
            ]
        );

        $repeater->add_control(
            'item_image',
            [
                'label'   => 'Associated Image',
                'type'    => \Elementor\Controls_Manager::MEDIA,
                'default' => [],
            ]
        );

        $repeater->add_control(
            'item_alt',
            [
                'label'       => 'Image Alt Text',
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => '',
                'label_block' => true,
            ]
        );

        $this->add_control(
            'list_items',
            [
                'label'       => 'List Items',
                'type'        => \Elementor\Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ item_text }}}',
                'default'     => [],
                'prevent_empty' => false,
            ]
        );

        $this->add_control(
            'icon_position',
            [
                'label'   => 'Icon Position',
                'type'    => \Elementor\Controls_Manager::SELECT,
                'default' => 'start',
                'options' => [
                    'start' => 'Before Text',
                    'end'   => 'After Text',
                ],
            ]
        );

        $this->add_control(
            'list_layout',
            [
                'label'   => 'List Layout',
                'type'    => \Elementor\Controls_Manager::SELECT,
                'default' => 'vertical',
                'options' => [
                    'vertical'   => 'Vertical',
                    'horizontal' => 'Horizontal',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_alignment',
            [
                'label'   => 'Alignment',
                'type'    => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'left' => [
                        'title' => 'Left',
                        'icon'  => 'eicon-text-align-left',
                    ],
                    'center' => [
                        'title' => 'Center',
                        'icon'  => 'eicon-text-align-center',
                    ],
                    'right' => [
                        'title' => 'Right',
                        'icon'  => 'eicon-text-align-right',
                    ],
                ],
                'default' => 'left',
                'selectors' => [
                    '{{WRAPPER}} .ois-list' =>
                        'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_section();

        /*
         * LIST STYLE
         */

        $this->start_controls_section(
            'section_list_style',
            [
                'label' => 'Icon List Styling',
                'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'list_text_color',
            [
                'label'     => 'Text Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .ois-list-text' =>
                        'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'list_icon_color',
            [
                'label'     => 'Icon Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .ois-list-icon' =>
                        'color: {{VALUE}}; fill: {{VALUE}};',
                    '{{WRAPPER}} .ois-list-icon svg' =>
                        'fill: {{VALUE}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_icon_size',
            [
                'label'      => 'Icon Size',
                'type'       => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', 'em' ],
                'range'      => [
                    'px' => [
                        'min' => 8,
                        'max' => 80,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 18,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-list-icon' =>
                        'font-size: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .ois-list-icon svg' =>
                        'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_item_spacing',
            [
                'label'      => 'Item Spacing',
                'type'       => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', 'em' ],
                'range'      => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 15,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-list' =>
                        'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_icon_spacing',
            [
                'label'      => 'Icon / Text Spacing',
                'type'       => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', 'em' ],
                'range'      => [
                    'px' => [
                        'min' => 0,
                        'max' => 50,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 10,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-list-item' =>
                        'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name'     => 'list_typography',
                'selector' => '{{WRAPPER}} .ois-list-text',
            ]
        );

        $this->add_control(
            'list_hover_color',
            [
                'label'     => 'Hover Text Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .ois-list-item:hover .ois-list-text' =>
                        'color: {{VALUE}};',
                    '{{WRAPPER}} .ois-list-item:focus-visible .ois-list-text' =>
                        'color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_section();
    }

    /**
     * Render the integrated list.
     */
    protected function render_icon_list( $items, $position = 'start', $layout = 'vertical' ) {

        if ( empty( $items ) ) {
            return;
        }

        $classes = [
            'ois-list',
            'ois-list-' . sanitize_html_class( $layout ),
        ];

        echo '<ul class="' . esc_attr( implode( ' ', $classes ) ) . '" role="list">';

        foreach ( $items as $index => $item ) {

            $text = $item['item_text'] ?? '';
            $icon = $item['item_icon'] ?? [];
            $link = $item['item_link'] ?? [];

            echo '<li class="ois-list-entry">';

            $tag = ! empty( $link['url'] ) ? 'a' : 'button';

            $attributes = '';

            if ( 'a' === $tag ) {
                $attributes .= ' href="' . esc_url( $link['url'] ) . '"';

                if ( ! empty( $link['is_external'] ) ) {
                    $attributes .= ' target="_blank"';
                    $attributes .= ' rel="noopener noreferrer"';
                } elseif ( ! empty( $link['nofollow'] ) ) {
                    $attributes .= ' rel="nofollow"';
                }
            } else {
                $attributes .= ' type="button"';
            }

            echo '<' . $tag . ' class="ois-list-item"';
            echo $attributes;
            echo ' data-oi-index="' . esc_attr( $index ) . '"';
            echo '>';

            if ( 'start' === $position ) {
                $this->render_list_icon( $icon );
            }

            echo '<span class="ois-list-text">';
            echo esc_html( $text );
            echo '</span>';

            if ( 'end' === $position ) {
                $this->render_list_icon( $icon );
            }

            echo '</' . $tag . '>';

            echo '</li>';
        }

        echo '</ul>';
    }

    /**
     * Render an individual Elementor icon.
     */
    protected function render_list_icon( $icon ) {

        if ( empty( $icon['value'] ) ) {
            return;
        }

        echo '<span class="ois-list-icon" aria-hidden="true">';

        \Elementor\Icons_Manager::render_icon(
            $icon,
            [ 'aria-hidden' => 'true' ]
        );

        echo '</span>';
    }
}

