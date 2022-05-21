export default class Modal {

    #clon
    #bModal // la instancia de bootstrap.Modal(...)

    constructor({
        width = '', // modal-sm | modal-lg | modal-xl (por defecto 500px)
        title = 'Título...',
        content = 'Contenido ...',
        buttons = []
    } = {}) {
        // clonar el nodo del DOM que tiene definido el modal
        const modal = document.querySelector('#modal')
        this.#clon = modal.cloneNode(true)

        // asignarle al nuevo nodo un identificador único y agregarlo al DOM
        const random = Math.floor(Math.random() *
                       99999999999999).toString().padStart(14, "0")
        this.#clon.id = `${this.#clon.id}-${random}`
        document.querySelector('#utilities').before(this.#clon)

        this.title = title
        this.content = content
        this.width = width

        this.#bModal = new bootstrap.Modal(
                           document.getElementById(this.#clon.id)
                       ) 
        document.querySelector(`#${this.#clon.id} header #close`)
            .addEventListener('click', () => this.close())

        const footer = document.querySelector(`#${this.#clon.id} footer`)

        if (buttons.length === 0) {
            footer.classList.add('visually-hidden');
        } else {
            buttons.forEach(b => this.#createButton(b, footer))
        }
    }


    get id() {
        return this.#clon.id
    }

    #createButton(b, footer) {
        const html = `<button id="${b.id}" class="${b.class}">${b.innerHTML}</button>`
        footer.insertAdjacentHTML('beforeend', html)
        const button = document.querySelector(`#${this.#clon.id} footer #${b.id}`)

        if (typeof b.callBack === 'function') {
            button.addEventListener('click', e => b.callBack(e))
        }
    }

    set title(strTitle) {
        document.querySelector(`#${this.#clon.id} #title`).innerHTML = strTitle
        return this
    }

    set content(strContent) {
        document.querySelector(`#${this.#clon.id} #content`).innerHTML = strContent
        return this
    }

    set width(strWidth) {
        if (strWidth.trim()) {
            document.querySelector(`#${this.#clon.id} > div`).classList.add(strWidth)
        }
        return this
    }




     close() {
        this.#bModal.hide()
        return this
    }

     dispose() {
        this.#bModal.hide()
        this.#bModal.dispose()   
        this.#bModal = this.#clon = null;
        console.log('El modal asociado a esta instancia fue eliminado de la memoria')
    }

    show() {
        if (this.#clon) {
            this.#bModal.show()
        } else {
            console.log('No hay una instancia de modal para ser mostrada');
        }
        return this
    }

}