/**
 * WCSOP actions on the front.
 */

(function($) {

    /**
     * Lookup order.
     */
    function lookupOrder(e) {
        e.preventDefault();

        $lookup_btn = $(this);
        $lookup_form = $(this).closest("form");

        // for the my account
        $lookup_number_elem = $("input#lookup_order_number");
        lookup_number = $("input#lookup_order_number").val();
        $lookup_email_elem = $("input#lookup_order_number");
        lookup_email = "";        

        $lookup_form.children(".woocommerce-error").remove();
        $lookup_form.children("p").children(".woocommerce-error").remove();

        // if the widget was used
        if($lookup_form.attr("id") == "wcsop_lookup_widget") {
            $lookup_number_elem = $("input#wcsop_lookup_order_widget__number");
            lookup_number = $("input#wcsop_lookup_order_widget__number").val();
            $lookup_email_elem = $("input#wcsop_lookup_order_widget__email");
            lookup_email = $("input#wcsop_lookup_order_widget__email").val();            
        }

        $lookup_form.block({
            message: null,
			overlayCSS: {
				background: '#fff',
				opacity: 0.6
			}
        });

        var data = {
            action: "wcsop_get_order",
            wcsop_number: lookup_number,
            wcsop_email: lookup_email,
        };

        $.post(wcsop.ajaxurl, data, function(response) {
            response = JSON.parse(response);
            if(response.error) {
                //throw error
                $(response.error.message).insertBefore($lookup_btn);
            } else if(response.logged) {
                $lookup_form.attr("action", response.logged);
                $lookup_form.submit();
            } else if(response.not_logged) {
                $lookup_form.submit();
            }
            $lookup_form.unblock();
        });
    }

    /**
     * Remove all the errors in current form
     */
    function removeWCErrors(e) {
        $("#wcsop_lookup_widget").children(".woocommerce-error").remove();
        $(".lookup-order").children("p").children(".woocommerce-error").remove();
    }


    /**
     * Activate/disable the `Merge` button
     * @param {Event} e 
     */
    function activate_disable_merge_button( e ) {
        var $merge_button = $( "a.woocommerce-button--merge" );

        if( $( "input.wcsop-merge-check:checked" ).length < 2 ) {
            $merge_button.attr( "disabled", "true" );
            return;
        }
        $merge_button.removeAttr( "disabled" );
    }

    function show_so_actions_list() {
        var so_actions_list = document.querySelector(".wcsop-front-actions-list");
        var btn = document.querySelector(".woocommerce-Button--so-actions");

        if(btn.classList.contains('expanded')) {
            // hide
            btn.classList.remove('expanded');
            so_actions_list.classList.remove('expanded');
        } else {
            // show
            btn.classList.add('expanded');
            so_actions_list.classList.add('expanded');
        }
    }

    /**
     * Ajax request for merging
     */
    function merge() {
        var $merge_button = $( "ul.wcsop-front-actions-list li[data-id='merge']" );
        var checked_inputs = $( "input.wcsop-merge-check:checked" );
        var ids = [];

        for( var i = 0; i < checked_inputs.length; i++ ) {
            ids.push( $( checked_inputs[i] ).data( "id" ) );
        }

        if(ids.length < 2) {
            alert('Choose at least 2 orders!');
            return;
        }

        if( !confirm( wcsop.sure ) ) {
            return;
        }
        var prev_text = $merge_button.text();
        $merge_button.text( "Processing..." );

        var data = {
            action: "wcsop_merge",
            ids: ids
        };

        $.post( wcsop.ajaxurl, data, function( response ) {
            $merge_button.text( prev_text );
            if( response.type == "success" ) {
                window.location.reload();
            } else {
                alert( response.msg );
            }
        } );
    }

    function mark_as() {
        var $btn = $(this);
        var checked_inputs = $( "input.wcsop-merge-check:checked" );
        var ids = [];

        for( var i = 0; i < checked_inputs.length; i++ ) {
            ids.push( $( checked_inputs[i] ).data( "id" ) );
        }

        if(ids.length < 1) {
            alert('Choose at least 1 order!');
            return;
        }

        if( !confirm( 'Are you sure?' ) ) {
            return;
        }

        var data = {
            action: "wcsop_add_custom_mark_bulk",
            order_ids: ids,
            mark_id: $btn.attr( "data-id" ),
        };
        var prev_text = $btn.text();
        $btn.text( "Processing..." );

        $.post( wcsop.ajaxurl, data, function(response) {
            for( var i = 0; i < checked_inputs.length; i++ ) {
                var order_markers = response[$(checked_inputs[i]).data('id')];
                var $container = $(checked_inputs[i]).closest('td').find('.wcsop_markers');
                if(!$container) {
                    $(checked_inputs[i]).closest('td').append('<div class="wcsop_markers"></div>');
                    $container = $(checked_inputs[i]).closest('td').find('.wcsop_markers');
                }
                $container.empty();
                $container.append(order_markers);
                $(checked_inputs[i]).prop('checked', false);
            }
            $btn.text( prev_text );
        } )
    }

    function remove_mark() {
        var $currentMark = $( this ).closest( "div.wcsop_custom_mark__orders_list" ).find( "span.wcsop_custom_mark_title__orders_list" );
        var data = {
            action: "wcsop_remove_custom_mark",
            order_id: $currentMark.attr( "data-order" ),
            mark_id: $currentMark.attr( "data-id" ),
            front: true
        };
        var $container = $currentMark.closest('.wcsop_markers');
        $container.css("opacity", 0.5);

        $.post( wcsop.ajaxurl, data, function(response) {
            $container.empty();
            $container.append(response);
            $container.css("opacity", 1);
        } );
    }

    function addOrderNote() {
        var $addNoteWrapper = $(this).closest('.wcsop-add-note');
        if ( ! $addNoteWrapper.find('textarea.add_order_note').val() ) {
            return;
        }

        $addNoteWrapper.closest('.wcsop-order-details-notes').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        var data = {
            action:    'wcsop_obp_add_note',
            post_id:   $addNoteWrapper.data('id'),
            note:      $addNoteWrapper.find('textarea.add_order_note').val(),
        };

        $.post( obpHelper.ajaxurl, data, function( response ) {
            $addNoteWrapper.closest('.wcsop-order-details-notes').html(response);
            $addNoteWrapper.closest('.wcsop-order-details-notes').unblock();
            $addNoteWrapper.find('textarea.add_order_note').val( '' );
        });

        return false;
    }

    $(document).on("click", "#wcsop_lookup_order", lookupOrder);
    $(document).on("click", "#wcsop_lookup_order_widget__button", lookupOrder);

    $(document).on("change click", "input#lookup_order_number, input#wcsop_lookup_order_widget__number, input#wcsop_lookup_order_widget__email", removeWCErrors);
    $( document ).on( "change", "input.wcsop-merge-check", activate_disable_merge_button );
    $( document ).on( "click", "a.woocommerce-button--so-actions", show_so_actions_list );
    $( document ).on( "click", "ul.wcsop-front-actions-list li[data-id='merge']", merge );
    $( document ).on( "click", "ul.wcsop-front-actions-list li.wcsop_mark_as", mark_as );
    $( document ).on( "click", "a.wcsop_custom_mark_remove__orders_list", remove_mark );
    $(document).on('click', '.wcsop_add_note', addOrderNote);

})(jQuery);