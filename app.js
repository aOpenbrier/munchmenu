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
    clearForm()
    document.getElementById('menusectionselect').innerHTML = ''
    document.getElementById('menusectionselect').dataset.tab = ''
    document.getElementById('menuitemselect').innerHTML = ''
    document.getElementById('menuitemselect').dataset.tab = ''
    document.getElementById('menuitemselect').dataset.section = ''
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
    clearForm()
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
        menu[event.target.dataset.tab][parseInt(event.target.value)]["section items"].forEach((item, iIndex) => {
            let option = document.createElement('option')
            option.value = iIndex
            option.innerText = item["name"]
            document.getElementById('menuitemselect').appendChild(option)
        })
    }
}

function itemSelect(event) {
console.log(event.target.value)
clearForm()

if (event.target.value) {
    const item = menu[event.target.dataset.tab][parseInt(event.target.dataset.section)]["section items"][parseInt(event.target.value)]
    console.log(item)
    if (item.name){ document.getElementById("itemname").value = item.name}
    if (item.description){ document.getElementById("itemdescription").value = item.description }
    if (item.price){ document.getElementById("itemprice").value = item.price}
    if (item.extras){ document.getElementById("itemextras").value = item.extras}
    if (item.options) {document.getElementById("itemoptions").value = item.options}
    if (item.featured) {document.getElementById("itemfeatured").checked = true}
    if (item.vegan) {document.getElementById("itemvegan").checked = true}
    if (item.vegetarian) {document.getElementById("itemvegetarian").checked = true}
    if (item["gf option"]) {document.getElementById("itemglutenoption").checked = true}
}


}
function clearForm() {
    document.getElementById("itemname").value = ''
    document.getElementById("itemdescription").value = ''
    document.getElementById("itemprice").value = ''
    document.getElementById("itemextras").value = ''
    document.getElementById("itemoptions").value = ''
    document.getElementById("itemfeatured").checked = false
    document.getElementById("itemvegan").checked = false
    document.getElementById("itemvegetarian").checked = false
    document.getElementById("itemglutenoption").checked = false
}