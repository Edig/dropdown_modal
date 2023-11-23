const defaults = {
    title: "",
    modal_class: ""
}

//TODO: DATA-WIDTH
//TODO: FONT SIZE
jQuery.fn.extend({

    /**
     * Create the dropdown modal
     * 
     * @param {*} options 
     */
    dropdown_modal: function (options = {}, ...args) {

        var message_modal = $()
        var modal = null

        const constructor = _ => {
            //Extends options
            jQuery.extend(defaults, options)

            //Add hidden style to the element
            this.css('display', 'none')

            //Create the dropdown button
            let btn_dom = document.createElement('button');
            btn_dom.type = 'button'
            btn_dom.classList.add('btn')
            btn_dom.classList.add('dropdown-toggle')
            btn_dom.classList.add('d-flex')
            btn_dom.classList.add('justify-content-between')
            btn_dom.classList.add('align-items-center')

            //Add extra classes from the select
            let btn_dom_extra_classes = this.prop('classList')
            btn_dom_extra_classes.forEach(element => {
                btn_dom.classList.add(element)
            })

            btn_dom.id = `${this.attr('id')}-dropdown-modal-btn`
            btn_dom.title = 'Cargando'
            btn_dom.innerText = 'Cargando'

            btn_dom.addEventListener('click', _ => {
                open_modal()
            })

            //Append Dropdown button
            this.after(btn_dom);
        }

        /**
         * Refresh options and update the dropdown
         */
        const refresh = _ => {
            //Select default value
            option_selected(this.val())
        }

        /**
         * Create and open modal 
         */
        const open_modal = _ => {
            //Load bootbox dependecy
            // const bootbox = require('bootbox')
            
            //Create modal message
            message_modal = $(`<ul class="list-group"></ul>`)

            //Get all options
            let select_options = this.find(`option`)

            //Append all options
            $.each(select_options, (index, e) => {
                let element = $(e)
                
                //Crate option
                let opt = $(`<li id='${element.val()}' class="list-group-item">${$(element).text()}</li>`)

                //On click function
                opt.on('click', _ => {
                    option_selected(element.val(), true)
                })

                //Append option
                message_modal.append(opt)
            })

            //Select default value
            option_selected(this.val())

            //Create bootbox dialog
            modal = bootbox.dialog({
                title: defaults.title,
                message: message_modal,
                closeButton: false,
                className: `dropdown-modal ${defaults.modal_class}`,
                centerVertical: true,
                backdrop: true
            })

            //Show dialog
            modal.show()
        }

        /**
         * Process when an option has been selected
         * @param {Int} id id of the option selected
         * @param {Boolean} clicked If the funtion has been called from clicked or default
         */
        const option_selected = (id, clicked = false) => {
            //Removr active class to everything else
            message_modal.find(`li`).removeClass('active')

            //Add class to the selected one
            message_modal.find(`li#${id}`).addClass('active')

            //Select the option on the select
            this.find(`option[value='${id}']`).prop('selected', true).trigger('change')

            //Change button text
            $(`#${this.attr('id')}-dropdown-modal-btn`).text(this.find(`option[value='${this.val()}']`).text())

            //Hide and destroy modal
            if (clicked) {
                modal.modal('hide');
                modal = null
            }
        }

        /**
         * Disable the dropdown button
         */
        const disable_button = _ => {
            $(`#${this.attr('id')}-dropdown-modal-btn`).attr('disabled' , true)
        }

        /**
         * Enable the dropdown button
         */
        const enable_button = _ => {
            $(`#${this.attr('id')}-dropdown-modal-btn`).attr('disabled' , false)
        }

        //Check option method or constructor
        if (options == 'refresh') {
            refresh()
        } else if (options == 'option_selected') {
            option_selected(...args)
        } else if (options == 'disable_button') {
            disable_button()
        } else if (options == 'enable_button') {
            enable_button()
        } else {
            constructor()
        }
    }
})
