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
        let tabForm = document.createElement('div')
        tabForm.className = 'row'
        tabForm.innerHTML = `
        <div class="col-6">
        <div class="rounded border shadow mb-3 p-2 bg-white">
        <form>
            <div class="form-group">
                <label for="tab-disclaimer-input">Menu Disclaimer: </label>
                <textarea name="details" id="tab-disclaimer-input" rows="${newMenu[event.target.dataset.tab].disclaimer ? '2' : '1'}" class="w-100 form-control">${newMenu[event.target.dataset.tab].disclaimer || ""}</textarea>
            </div>
            <small>*Displayed at the bottom of current menu tab, after all sections</small>
        </form>
        </div>
        </div>
        <div class="col-6">
        <div class="menu shadow mb-3">
        <div class="menudisclaimer">
        ${newMenu[event.target.dataset.tab].disclaimer || ""}
        </div>
        </div>
        </div>
        `
        document.getElementById('forms-container').appendChild(tabForm)

        // section editing forms
        let sectionForm = document.createElement('div')
        sectionForm.className = 'row'
        sectionForm.innerHTML = `
        <div class="col-6">
        <div class="rounded border shadow mb-3 p-2 bg-white">
        <form>
            <div class="form-group">
                <label for="section-title-input">Section Title: </label>
                <input type="text" name="title" id="section-title-input" class="w-100 form-control" value="${newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section title"] || ""}">
            </div>
            <div class="form-group">
                <label for="section-details-input">Section Details: </label>
                <textarea name="details" id="section-details-input" rows="${newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section details"] ? '2' : '1'}" class="w-100 form-control">${newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section details"] || ""}</textarea>
            </div>
        </form>
        </div>
        </div>
        <div class="col-6">
        <div class="menu shadow mb-3">
        <h3 class="sectiontitle">${newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section title"]}</h3>
        <p class="sectiondetails">${newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section details"] || ""}</p>
        </div>
        </div>
        `
        document.getElementById('forms-container').appendChild(sectionForm)

        
        // list forms for menu-items
        if (newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"]){
        let itemsH = document.createElement('h3')
        itemsH.innerText = "Detailed Items:"
        document.getElementById('forms-container').appendChild(itemsH)

        newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"].forEach((item, iIndex) => {

            let itemForm = document.createElement('div')
            itemForm.className = 'row'
            itemForm.innerHTML = `
                <div class="col-6">
                <div class="rounded border shadow mb-3 p-2 bg-white">
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
                </form>
                </div>
                </div>
                <div class="col-6">
                <div class="menu shadow mb-3">
                <div class="sectionitem">
                    ${ item.price ? `<p class="itemprice">${`${item.price.toString().split('.')[1] ? item.price.toFixed(2) : item.price}`}</p>` : '' }
                    ${ item.name ? `<h5 class="itemname">${item.name}</h5>` : '' }
                    ${ item.description ? `<p class="itemdesc">${item.description}</p>` : '' }
                    ${ item["gf option"] ? `<p class="itemdietary">*Gluten-free optional</p>` : '' }
                    ${ item.vegan ? `<p class="itemdietary">*Vegan</p>` : '' }
                    ${ item.vegetarian ? `<p class="itemdietary">*Vegetarian</p>` : '' }
                    ${ item.extras ? `<p class="itemextras">${item.extras}</p>` : '' }
                    ${ item.options ? `<p class="itemoptions">${item.options}</p>` : '' }
                    <div class="itemimgwrapper">
                        ${item.image ? `
                    <div class="itemimage" style="background-image:url(https://www.adamopenbrier.com/munchthai/assets/images/${item.image})">
                        <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fwww.munchthai.com%2Fmenu%2F${item.image.split('.')[0]}.html&layout=button&size=small&width=59&height=20&appId" width="59" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
                    </div>` : ''}
                        ${item.featured ? `<p class="itemfeatured">FEATURED</p>` : ''}
                    </div>
                </div>
                </div>
                </div>
                `
            document.getElementById('forms-container').appendChild(itemForm)
        })
    }
        // list forms for item-list
        let itemListH = document.createElement('h3')
        itemListH.innerText = "Listed Items:"
        document.getElementById('forms-container').appendChild(itemListH)
        let sectionList = newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section list"]
        let listedItemsForm = document.createElement('div')
        listedItemsForm.className = 'row'
        listedItemsForm.innerHTML = `
            <div class="col-6">
            <div class="rounded border shadow mb-3 p-2 bg-white"
            <form id="list-form">

                <div class="form-group">
                    <label for="item-list-input">Items: </label>
                    <textarea name="list" id="item-list-input" rows="5" class="w-100 form-control">${sectionList || ""}</textarea>
                </div>

            </form>
            </div>
            </div>
            <div class="col-6">
            <div class="menu shadow mb-3">
            <div class="sectionlist">
                ${sectionList || ""}
            </div>
            </div>
            </div>`
        document.getElementById('forms-container').appendChild(listedItemsForm)
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