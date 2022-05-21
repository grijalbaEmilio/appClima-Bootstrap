export default class Toast {

    static #instance = false

    set instance(instance) {
        this.#instance = instance
    }

    get instance() {
        return this.#instance
    }

    static info = ({ message = '', mode = 'info', error = '' } = {}) => {
        mode = mode.toLowerCase()
        let background, colour, title, icon

        if (mode === 'success') {
            title = 'Acción exitosa'
            background = 'bg-success'
            colour = 'text-light'
            icon = '<i class="bi bi-check-square-fill me-2"></i>'
        } else if (mode === 'warning') {
            title = '¡Cuidado!'
            colour = 'text-body'
            background = 'bg-warning'
            icon = '<i class="bi bi-exclamation-square-fill text-dark me-2"></i>'
        } else if (mode === 'danger') {
            title = 'Problemas...'
            background = 'bg-danger'
            colour = 'text-light'
            icon = '<i class="bi bi-x-octagon-fill text-danger me-2"></i>'
        } else {
            title = 'Aviso'
            background = 'bg-info'
            colour = 'text-light'
            icon = '<i class="bi bi-info-square-fill me-2"></i>'
        }

        if (!this.instance) {
            console.error(`Falta la referencia a un toast. Ejemplo: 
               Toast.instance = new bootstrap.Toast(
                   document.querySelector('#message'), { delay: 3000 })`
            )
            return
        }

        let container = `#${this.instance._element.id}`

        if (error) {
            console.error(error)
        }

        document.querySelector(`${container} #icon`).innerHTML = icon
        document.querySelector(`${container} .me-auto`).innerHTML = title
        document.querySelector(`${container} .toast-body`).innerHTML = message

        const elemento = document.querySelector(container)
        elemento.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-info')
        elemento.classList.add(background, colour)
        
        // si no se despliega el Toast posiblemente requiera un zIndex >= 11: 
        // document.querySelector('#on-top').style.zIndex = '11'
        this.instance.show()

    }
}