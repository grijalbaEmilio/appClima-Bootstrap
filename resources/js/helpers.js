export default class Helpers {

    /**
     * 
     * @param {String} selector  selector de la etiqueta de tipo radio
     * @returns {String} valor del radio seleccionado
     */
    static selectedRadioButton = selector => {
        const radio = document.querySelector(selector + ":checked")
        return radio ? radio.value : radio
    }

    /**
     * 
     * @param {String} selector nombre de la etiqueta de tipo radio
     * @returns {Array} lista de los elementos seleccionados 
     */
    static getItems = selector => {
        const items = document.querySelectorAll(selector)
        return [...items].map((item) => {                         // ... es el operador de propagación que convierte la lista de nodos en un array
            return { value: item.value, checked: item.checked }   // .map() estrae solo los elementos value con cheked true
        })
    }

    /**
     * 
     * @param {String} selector nombre de la etiqueta select
     * @returns {oject} objeto elejido
     */
    static selectedItemList = selector => {
        const list = document.querySelector(selector)
        const item = list.options[list.selectedIndex]

        return {
            selectedIndex: list.selectedIndex,
            value: item.value,
            text: item.text,
        }
    }

    /**
     * 
     * @param {String} selector nombre de la etiquera select
     * @param {Array} items array con los JSON 
     * @param {String} value nombre del primer atributo 
     * @param {String} text nombre del segundo atributo
     * @param {String} firstOption nombre del elemento que se quiera en la primera Opción del select
     * @returns {Array} arreglo del los Options dentro del select
     */

    static populateSelectList = (
        selector, items = [], value = '', text = '', firstOption = ''
    ) => {
        let list = document.querySelector(selector)
        list.options.length = 0
        if (firstOption) {
            list.add(new Option(firstOption, ''))
        }
        items.forEach(item => list.add(new Option(item[text], item[value])))
        return list
    }

    /**
     * 
     * @param {String} url ruta del archivo html a cargar
     * @param {String} container nombre del contenedor a ser reemplazado
     * @returns {String} el archivo html en formato txt
     */

    static loadPage = async (url, container) => {

        try {
            const element = document.querySelector(container)

            if (!element) {
                throw new Error(`El selector '${container}' no es válido`)
            }

            const response = await fetch(url)
            // console.log(response);
            if (response.ok) {
                const html = await response.text()
                element.innerHTML = html
                return element // para permitir encadenamiento
            } else {
                throw new Error(
                    `${response.status} - ${response.statusText}, al intentar
                     acceder al recurso '${response.url}'`
                )
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 
     * @param {String} url del archivo JSON
     * @returns {JSON} retorna el  json
     */

    static fetchData = async url => {

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(
                `${response.status} - ${response.statusText}, 
                 al intentar acceder al recurso '${response.url}'`
            )
        }

        /* console.log(await response.json()) */
        return await response.json()
    }




}