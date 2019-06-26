let menu, newMenu
let tabplaceholder = document.createElement('option')
tabplaceholder.value = ''
tabplaceholder.innerText = 'Select a Menu Tab'
tabplaceholder.setAttribute('selected', true)
document.getElementById('menutabselect').appendChild(tabplaceholder)

fetch('https://www.adamopenbrier.com/munchthai/assets/js/menu.json')
    .then(r => r.json())
    .then(r => {
        menu = r
        newMenu = r
        console.log(r)
        r.forEach((tab, tabIndex) => {
            let taboption = document.createElement('option')
            taboption.value = tabIndex
            taboption.innerText = tab.id
            document.getElementById('menutabselect').appendChild(taboption)
        })
    })
    .catch(e => console.log(e))

function tabSelect(event) {
    document.getElementById('forms-container').innerHTML = ''
    document.getElementById('menusectionselect').innerHTML = ''
    document.getElementById('menusectionselect').dataset.tab = ''
    if (event.target.value) {
        document.getElementById('menusectionselect').dataset.tab = event.target.value
        let selectplaceholder = document.createElement('option')
        selectplaceholder.value = ''
        selectplaceholder.innerText = 'Select a Menu Section'
        selectplaceholder.setAttribute('selected', true)
        document.getElementById('menusectionselect').appendChild(selectplaceholder)
        newMenu[event.target.value].sections.forEach((section, sIndex) => {
            let option = document.createElement('option')
            option.value = sIndex
            option.innerText = section["section title"]
            document.getElementById('menusectionselect').appendChild(option)
        })
    }
}

function sectionSelect(event) {
    document.getElementById('forms-container').innerHTML = ''
    if (event.target.value) {
 
        // list forms for menu-items
        if (newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"]){
        newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"].forEach((item, iIndex) => {

            let itemForm = document.createElement('div')
            itemForm.className = 'rounded border shadow mb-3 p-2 bg-white'
            itemForm.innerHTML = `
                    <form id="item-${iIndex}-form" data-item="${iIndex}" class="item-form">
                    <div class="form-group">
                        <label for="item-${iIndex}-name">Name: </label>
                        <input type="text" name="name" id="item-${iIndex}-name" data-item="${iIndex}" class="w-100 form-control" value="${item.name || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${iIndex}-description">Description: </label>
                        <textarea name="description" id="item-${iIndex}-description" data-item="${iIndex}" rows="${item.description ? '2': '1'}" class="w-100 form-control">${item.description || ""}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="item-${iIndex}-price">Image: </label>
                        <input type="text" name="image" id="item-${iIndex}-image" data-item="${iIndex}" class="w-100 form-control" value="${item.image || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${iIndex}-price">Price: </label>
                        <input type="number" name="price" id="item-${iIndex}-price" data-item="${iIndex}" class="w-100 form-control" value="${item.price || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${iIndex}-extras">Extras: </label>
                        <textarea name="extras" id="item-${iIndex}-extras" data-item="${iIndex}" rows="${item.extras ? '3' : '1'}" class="w-100 form-control">${item.extras || ""}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="item-${iIndex}-options">Options: </label>
                        <textarea name="options" id="item-${iIndex}-options" data-item="${iIndex}" rows="${item.options ? '3' : '1'}" class="w-100 form-control" >${item.options || ""}</textarea>

                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="item-${iIndex}-featured">Featured: </label>
                                <input type="checkbox" name="featured" id="item-${iIndex}-featured" data-item="${iIndex}" ${item.featured ? "checked" : ""} >
                            </div>

                            <div class="form-group">
                                <label for="item-${iIndex}-glutenoption">Gluten Free Option: </label>
                                <input type="checkbox" name="glutenoption" id="item-${iIndex}-glutenoption" data-item="${iIndex}" ${item["gf option"] ? "checked" : ""}>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="item-${iIndex}-vegan">Vegan: </label>
                                <input type="checkbox" name="vegan" id="item-${iIndex}-vegan" data-item="${iIndex}" ${item.vegan ? "checked" : ""} >
                            </div>

                            <div class="form-group">
                                <label for="item-${iIndex}-vegetarian">Vegetarian: </label>
                                <input type="checkbox" name="vegetarian" id="item-${iIndex}-vegetarian" data-item="${iIndex}" ${item.vegetarian ? "checked" : ""} >
                            </div>
                        </div>
                    </div>
                </form>`
            document.getElementById('forms-container').appendChild(itemForm)
        })
    }
        // list forms for item-list
        let sectionList = newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section list"]
        let itemForm = document.createElement('div')
        itemForm.className = 'rounded border shadow mb-3 p-2 bg-white'
        itemForm.innerHTML = `
            <form id="list-form" class="item-form">

                <div class="form-group">
                    <label for="item-list">Listed Items: </label>
                    <textarea name="list" id="item-list" rows="5" class="w-100 form-control">${sectionList || ""}</textarea>
                </div>

            </form>`
        document.getElementById('forms-container').appendChild(itemForm)

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