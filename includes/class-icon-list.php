<?php
/**
 * Integrated Icon List controls for Offer Image Stack.
 * Version: 3.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

trait OIS_Icon_List_Controls {

    protected function register_icon_list_controls() {

        /*
         * CONTENT: ICON LIST
         */

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
                'label'       => 'Link',
                'type'        => \Elementor\Controls_Manager::URL,
                'placeholder' => 'https://your-link.com',
                'options'     => [ 'url', 'is_external', 'nofollow' ],
                'default'     => [
                    'url'         => '',
                    'is_external' => false,
                    'nofollow'    => false,
                ],
            ]
        );

        $repeater->add_control(
            'item_image',
            [
                'label'       => 'Associated Image',
                'type'        => \Elementor\Controls_Manager::MEDIA,
                'default'     => [],
                'description' => 'Choose the image associated with this list entry.',
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
                'label'         => 'List Items',
                'type'          => \Elementor\Controls_Manager::REPEATER,
                'fields'        => $repeater->get_controls(),
                'title_field'   => '{{{ item_text }}}',
                'default'       => [],
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

        $this->end_controls_section();

        /*
         * STYLE: LIST
         */

        $this->start_controls_section(
            'section_list_style',
            [
                'label' => 'List',
                'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'list_space_between',
            [
                'label'      => 'Space Between',
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
         * STYLE: DIVIDER
         */

        $this->start_controls_section(
            'section_divider_style',
            [
                'label' => 'Divider',
                'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'list_divider',
            [
                'label'        => 'Divider',
                'type'         => \Elementor\Controls_Manager::SWITCHER,
                'label_on'     => 'Yes',
                'label_off'    => 'No',
                'return_value' => 'yes',
                'default'      => '',
            ]
        );

        $this->add_control(
            'list_divider_style',
            [
                'label'     => 'Style',
                'type'      => \Elementor\Controls_Manager::SELECT,
                'default'   => 'solid',
                'options'   => [
                    'solid'  => 'Solid',
                    'double' => 'Double',
                    'dotted' => 'Dotted',
                    'dashed' => 'Dashed',
                ],
                'condition' => [
                    'list_divider' => 'yes',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_divider_weight',
            [
                'label'      => 'Weight',
                'type'       => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px' ],
                'range'      => [
                    'px' => [
                        'min' => 1,
                        'max' => 10,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 1,
                ],
                'condition' => [
                    'list_divider' => 'yes',
                ],
            ]
        );

        $this->add_responsive_control(
            'list_divider_width',
            [
                'label'      => 'Width',
                'type'       => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ '%', 'px' ],
                'range'      => [
                    '%' => [
                        'min' => 10,
                        'max' => 100,
                    ],
                    'px' => [
                        'min' => 10,
                        'max' => 1000,
                    ],
                ],
                'default' => [
                    'unit' => '%',
                    'size' => 100,
                ],
                'condition' => [
                    'list_divider' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'list_divider_color',
            [
                'label'     => 'Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
                'default'   => '#dddddd',
                'condition' => [
                    'list_divider' => 'yes',
                ],
            ]
        );

        $this->end_controls_section();


        /*
         * STYLE: ICON
         */

        $this->start_controls_section(
            'section_icon_style',
            [
                'label' => 'Icon',
                'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->start_controls_tabs( 'icon_style_tabs' );

        $this->start_controls_tab(
            'icon_normal',
            [
                'label' => 'Normal',
            ]
        );

        $this->add_control(
            'list_icon_color',
            [
                'label'     => 'Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
            ]
        );

        $this->end_controls_tab();

        $this->start_controls_tab(
            'icon_hover',
            [
                'label' => 'Hover',
            ]
        );

        $this->add_control(
            'list_icon_hover_color',
            [
                'label'     => 'Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
            ]
        );

        $this->end_controls_tab();

        $this->end_controls_tabs();

        $this->add_responsive_control(
            'list_icon_size',
            [
                'label'      => 'Size',
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
            'list_icon_spacing',
            [
                'label'      => 'Gap',
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

        $this->add_responsive_control(
            'icon_horizontal_alignment',
            [
                'label'   => 'Horizontal Alignment',
                'type'    => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'flex-start' => [
                        'title' => 'Left',
                        'icon'  => 'eicon-h-align-left',
                    ],
                    'center' => [
                        'title' => 'Center',
                        'icon'  => 'eicon-h-align-center',
                    ],
                    'flex-end' => [
                        'title' => 'Right',
                        'icon'  => 'eicon-h-align-right',
                    ],
                ],
                'default' => 'center',
                'selectors' => [
                    '{{WRAPPER}} .ois-list-icon' =>
                        'justify-content: {{VALUE}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'icon_vertical_alignment',
            [
                'label'   => 'Vertical Alignment',
                'type'    => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'flex-start' => [
                        'title' => 'Top',
                        'icon'  => 'eicon-v-align-top',
                    ],
                    'center' => [
                        'title' => 'Middle',
                        'icon'  => 'eicon-v-align-middle',
                    ],
                    'flex-end' => [
                        'title' => 'Bottom',
                        'icon'  => 'eicon-v-align-bottom',
                    ],
                ],
                'default' => 'center',
                'selectors' => [
                    '{{WRAPPER}} .ois-list-item' =>
                        'align-items: {{VALUE}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'icon_vertical_position',
            [
                'label' => 'Adjust Vertical Position',
                'type'  => \Elementor\Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => -30,
                        'max' => 30,
                    ],
                ],
                'default' => [
                    'size' => 0,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ois-list-icon' =>
                        'transform: translateY({{SIZE}}px);',
                ],
            ]
        );

        $this->end_controls_section();

            /*
         * STYLE: TEXT
         */

        $this->start_controls_section(
            'section_text_style',
            [
                'label' => 'Text',
                'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name'     => 'list_typography',
                'selector' => '{{WRAPPER}} .ois-list-text',
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Text_Shadow::get_type(),
            [
                'name'     => 'list_text_shadow',
                'selector' => '{{WRAPPER}} .ois-list-text',
            ]
        );

        $this->start_controls_tabs( 'text_style_tabs' );

        $this->start_controls_tab(
            'text_normal',
            [
                'label' => 'Normal',
            ]
        );

        $this->add_control(
            'list_text_color',
            [
                'label'     => 'Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .ois-list-text' =>
                        'color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_tab();

        $this->start_controls_tab(
            'text_hover',
            [
                'label' => 'Hover',
            ]
        );

        $this->add_control(
            'list_hover_color',
            [
                'label'     => 'Colour',
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .ois-list-item:hover .ois-list-text' =>
                        'color: {{VALUE}};',
                    '{{WRAPPER}} .ois-list-item:focus-visible .ois-list-text' =>
                        'color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_tab();

        $this->end_controls_tabs();

        $this->end_controls_section();
    }


    /**
     * Render integrated list.
     */
    protected function render_icon_list(
        $items,
        $position = 'start',
        $layout = 'vertical'
    ) {

        if ( empty( $items ) ) {
            return;
        }

        $settings = $this->get_settings_for_display();

        $show_divider = (
            isset( $settings['list_divider'] ) &&
            'yes' === $settings['list_divider']
        );

        $divider_style = $settings['list_divider_style'] ?? 'solid';
        $divider_weight = $settings['list_divider_weight']['size'] ?? 1;
        $divider_width = $settings['list_divider_width']['size'] ?? 100;
        $divider_width_unit = $settings['list_divider_width']['unit'] ?? '%';
        $divider_color = $settings['list_divider_color'] ?? '#dddddd';

        $classes = [
            'ois-list',
            'ois-list-' . sanitize_html_class( $layout ),
        ];

        echo '<ul class="' . esc_attr( implode( ' ', $classes ) ) . '" role="list">';

        $total_items = count( $items );
        $current_item = 0;

        foreach ( $items as $index => $item ) {

            $text = $item['item_text'] ?? '';
            $icon = $item['item_icon'] ?? [];
            $link = $item['item_link'] ?? [];

            $url = ! empty( $link['url'] )
                ? $link['url']
                : '';

            echo '<li class="ois-list-entry">';

            if ( $url ) {

                $attributes = ' href="' . esc_url( $url ) . '"';

                $rel = [];

                if ( ! empty( $link['is_external'] ) ) {
                    $attributes .= ' target="_blank"';
                    $rel[] = 'noopener';
                    $rel[] = 'noreferrer';
                }

                if ( ! empty( $link['nofollow'] ) ) {
                    $rel[] = 'nofollow';
                }

                if ( ! empty( $rel ) ) {
                    $attributes .= ' rel="' . esc_attr(
                        implode( ' ', array_unique( $rel ) )
                    ) . '"';
                }

                echo '<a class="ois-list-item"';
                echo $attributes;

            } else {

                echo '<span class="ois-list-item"';

            }

            echo ' data-oi-index="' . esc_attr( $index ) . '">';

            if ( 'start' === $position ) {
                $this->render_list_icon( $icon );
            }

            echo '<span class="ois-list-text">';
            echo esc_html( $text );
            echo '</span>';

            if ( 'end' === $position ) {
                $this->render_list_icon( $icon );
            }

            echo $url ? '</a>' : '</span>';

            echo '</li>';

            $current_item++;

            /*
             * Divider between items only.
             */

            if (
                $show_divider &&
                $current_item < $total_items
            ) {

                $divider_css = sprintf(
                    'border-style:%1$s;border-width:%2$s;border-color:%3$s;width:%4$s;',
                    esc_attr( $divider_style ),
                    esc_attr( $divider_weight ) . 'px',
                    esc_attr( $divider_color ),
                    esc_attr( $divider_width ) . esc_attr( $divider_width_unit )
                );

                if ( 'horizontal' === $layout ) {
                    $divider_css .= 'width:0;height:100%;';
                    $divider_css .= 'border-width:0 0 0 ' . esc_attr( $divider_weight ) . 'px;';
                }

                echo '<li class="ois-list-divider" aria-hidden="true" style="' . esc_attr( $divider_css ) . '"></li>';
            }
        }

        echo '</ul>';
    }


    /**
     * Render individual Elementor icon.
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
