let tabplaceholder = document.createElement('option')
tabplaceholder.value = ''
tabplaceholder.innerText = 'Select a Menu Tab'
tabplaceholder.setAttribute('selected', true)
document.getElementById('menutabselect').appendChild(tabplaceholder)
for (const key in menu) {
    let taboption = document.createElement('option')
    taboption.value = key
    taboption.innerText = key
    document.getElementById('menutabselect').appendChild(taboption)
}

function tabSelect(event) {
    document.getElementById('menusectionselect').innerHTML = ''
    document.getElementById('menusectionselect').dataset.tab = ''
    if (event.target.value) {
        document.getElementById('menusectionselect').dataset.tab = event.target.value
        let selectplaceholder = document.createElement('option')
        selectplaceholder.value = ''
        selectplaceholder.innerText = 'Select a Menu Section'
        selectplaceholder.setAttribute('selected', true)
        document.getElementById('menusectionselect').appendChild(selectplaceholder)
        menu[event.target.value].forEach((section, sIndex) => {
            let option = document.createElement('option')
            option.value = sIndex
            option.innerText = section["section title"]
            document.getElementById('menusectionselect').appendChild(option)
        })
    }
}

function sectionSelect(event) {
    document.getElementById('menuitemselect').innerHTML = ''
    document.getElementById('menuitemselect').dataset.tab = ''
    document.getElementById('menuitemselect').dataset.section = ''
    if (event.target.value) {
        document.getElementById('menuitemselect').dataset.tab = event.target.dataset.tab
        document.getElementById('menuitemselect').dataset.section = event.target.value
        let selectplaceholder = document.createElement('option')
        selectplaceholder.value = ''
        selectplaceholder.innerText = 'Select a Menu Section'
        selectplaceholder.setAttribute('selected', true)
        document.getElementById('menuitemselect').appendChild(selectplaceholder)
        menu[event.target.getAttribute('data-tab')][parseInt(event.target.value)]["section items"].forEach((item, iIndex) => {
            let option = document.createElement('option')
            option.value = iIndex
            option.innerText = item["name"]
            document.getElementById('menuitemselect').appendChild(option)
        })
    }
}