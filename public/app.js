let menuEdit
const tabSel = document.getElementById('menutabselect')
const sectSel = document.getElementById('menusectionselect')
const formsContainer = document.getElementById('forms-container')

function sourceSelect(event) {
    // API route passed as select El value
    const source = event.target.value
    if (source) {
        tabSel.innerHTML = ''
        sectSel.innerHTML = ''
        formsContainer.innerHTML = ''
        // create placeholder option with no value
        let tabplaceholder = document.createElement('option')
        tabplaceholder.value = ''
        tabplaceholder.innerText = 'Select a Menu Tab'
        tabplaceholder.setAttribute('selected', true)
        tabSel.appendChild(tabplaceholder)
        // get list of menu tabs and populate select options
        fetch(source)
            .then(r => r.json())
            .then(r => {
                menuEdit = r

                r.forEach((tab, tabIndex) => {
                    let tabOption = document.createElement('option')
                    tabOption.value = tabIndex
                    tabOption.innerText = tab.id
                    tabSel.appendChild(tabOption)
                })
            })
            .catch(e => console.log(e))
    }
}

function tabSelect() {
    sectSel.innerHTML = ''
    formsContainer.innerHTML = ''
    if (tabSel.value) {
        let selectplaceholder = document.createElement('option')
        selectplaceholder.value = ''
        selectplaceholder.innerText = 'Select a Menu Section'
        selectplaceholder.setAttribute('selected', true)
        sectSel.appendChild(selectplaceholder)
        menuEdit[tabSel.value].sections.forEach((section, sIndex) => {
            let option = document.createElement('option')
            option.value = sIndex
            option.innerText = section["section title"]
            sectSel.appendChild(option)
        })
    }
}

function sectionSelect() {
    formsContainer.innerHTML = ''
    if (sectSel.value) {
        let tabForm = document.createElement('div')
        tabForm.className = 'row align-items-center'
        tabForm.innerHTML = `
        <div class="col-6">
        <div class="rounded border shadow mb-3 p-2 bg-white">
        <form id="disclaimer-form" oninput="changeDisclaimer()">
            <div class="form-group">
                <label for="tab-disclaimer-input">Menu Disclaimer: </label>
                <textarea name="details" id="tab-disclaimer-input" rows="${menuEdit[tabSel.value].disclaimer ? '2' : '1'}" class="w-100 form-control">${menuEdit[tabSel.value].disclaimer || ""}</textarea>
            </div>
            <small>*Displayed at the bottom of current menu tab, after all sections</small>
        </form>
        </div>
        </div>
        <div class="col-6">
        <div class="menu shadow mb-3">
        <div id="tab-disclaimer-output" class="menudisclaimer">
        ${menuEdit[tabSel.value].disclaimer || ""}
        </div>
        </div>
        </div>
        `
        formsContainer.appendChild(tabForm)

        // section editing forms
        let sectionForm = document.createElement('div')
        sectionForm.className = 'row align-items-center'
        sectionForm.innerHTML = `
        <div class="col-6">
        <div class="rounded border shadow mb-3 p-2 bg-white">
        <form id="section-form" oninput="changeSection()">
            <div class="form-group">
                <label for="section-title-input">Section Title: </label>
                <input type="text" name="title" id="section-title-input" class="w-100 form-control" value="${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section title"] || ""}">
            </div>
            <div class="form-group">
                <label for="section-details-input">Section Details: </label>
                <textarea name="details" id="section-details-input" rows="${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section details"] ? '2' : '1'}" class="w-100 form-control">${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section details"] || ""}</textarea>
            </div>
        </form>
        </div>
        </div>
        <div class="col-6">
        <div class="menu shadow mb-3">
        <h3 id="section-title-output" class="sectiontitle">${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section title"]}</h3>
        <p id="section-details-output" class="sectiondetails">${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section details"] || ""}</p>
        </div>
        </div>
        `
        formsContainer.appendChild(sectionForm)


        if (menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section items"]) {
            // create detailed items headline and "Add" button
            let itemsHead = document.createElement('div')
            itemsHead.className = 'row'
            itemsHead.innerHTML = '<div class="col-6"><h3>Detailed Items:</h3></div><div class="col-6"> <a class="text-white btn btn-primary" onclick="addItem()">Add Item</a></div>'
            formsContainer.appendChild(itemsHead)
            // create container for detailed items
            let detailedItems = document.createElement('div')
            detailedItems.id = 'detailed-items'
            formsContainer.appendChild(detailedItems)

            // create forms and previews for each detailed menu item
            menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section items"].forEach((item, iIndex) => {
                

                let itemForm = document.createElement('div')
                itemForm.id = `row-$iIndex`
                itemForm.className = 'row align-items-center'

                itemForm.innerHTML = itemFormHtml(item, iIndex)

                document.getElementById('detailed-items').appendChild(itemForm)
                updatePreview(iIndex)
            })
        }
        // list forms for item-list
        let itemListH = document.createElement('h3')
        itemListH.innerText = "Listed Items:"
        formsContainer.appendChild(itemListH)
        let sectionList = menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section list"]
        let listedItemsForm = document.createElement('div')
        listedItemsForm.className = 'row align-items-center'
        listedItemsForm.innerHTML = `
            <div class="col-6">
            <div class="rounded border shadow mb-3 p-2 bg-white"
            <form id="list-form" oninput="changeList()">

                <div class="form-group">
                    <label for="item-list-input">Items: </label>
                    <textarea name="list" id="item-list-input" rows="5" class="w-100 form-control">${sectionList || ""}</textarea>
                </div>

            </form>
            </div>
            </div>
            <div class="col-6">
            <div class="menu shadow mb-3">
            <div id="item-list-output" class="sectionlist">
                ${sectionList || ""}
            </div>
            </div>
            </div>`
        formsContainer.appendChild(listedItemsForm)
    }
}

function itemFormHtml(item, iIndex) {
    return `
                <div class="col-6">
                <div class="rounded border shadow mb-3 p-2 bg-white">
                    <form id="item-${iIndex}-form" data-item="${iIndex}" class="item-form" oninput="changeItem(${iIndex})">
                    <div class="form-group">
                        <label for="item-${iIndex}-name">Name: </label>
                        <input type="text" name="name" id="item-${iIndex}-name" data-item="${iIndex}" class="w-100 form-control" value="${item.name || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${iIndex}-description">Description: </label>
                        <textarea name="description" id="item-${iIndex}-description" data-item="${iIndex}" rows="${item.description ? '2' : '1'}" class="w-100 form-control">${item.description || ""}</textarea>
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
                    <div class="row">
                        <div class="col-6">
                            <a class="btn btn-danger text-white" id="item-delete-${iIndex}" onclick="deleteItem(event)">Delete</a>
                        </div>
                    </div>
                </form>
                </div>
                </div>
                <div class="col-6">
                <div class="menu shadow mb-3">
                <div id="item-${iIndex}-output" class="sectionitem">

                </div>
                </div>
                </div>
                `
}

function changeDisclaimer() {
    document.getElementById('saved').classList.remove('saved')
    document.getElementById('tab-disclaimer-output').innerHTML = document.getElementById('tab-disclaimer-input').value
}

function changeSection() {
    document.getElementById('saved').classList.remove('saved')
    document.getElementById('section-title-output').innerHTML = document.getElementById('section-title-input').value
    document.getElementById('section-details-output').innerHTML = document.getElementById('section-details-input').value
}

function changeItem(index) {
    document.getElementById('saved').classList.remove('saved')
    updatePreview(index)
}

function updatePreview(index) {
    const name = document.getElementById(`item-${index}-name`).value
    const description = document.getElementById(`item-${index}-description`).value
    const image = document.getElementById(`item-${index}-image`).value
    const price = parseFloat(document.getElementById(`item-${index}-price`).value)
    const extras = document.getElementById(`item-${index}-extras`).value
    const options = document.getElementById(`item-${index}-options`).value
    const featured = document.getElementById(`item-${index}-featured`).checked
    const vegan = document.getElementById(`item-${index}-vegan`).checked
    const vegetarian = document.getElementById(`item-${index}-vegetarian`).checked
    const glutenOption = document.getElementById(`item-${index}-glutenoption`).checked
    document.getElementById(`item-${index}-output`).innerHTML = `
    ${price ? `<p class="itemprice">${`${price.toString().split('.')[1] ? price.toFixed(2) : price}`}</p>` : ''}
                    ${ name ? `<h5 class="itemname">${name}</h5>` : ''}
                    ${ description ? `<p class="itemdesc">${description}</p>` : ''}
                    ${ glutenOption ? `<p class="itemdietary">*Gluten-free optional</p>` : ''}
                    ${ vegan ? `<p class="itemdietary">*Vegan</p>` : ''}
                    ${ vegetarian ? `<p class="itemdietary">*Vegetarian</p>` : ''}
                    ${ extras ? `<p class="itemextras">${extras}</p>` : ''}
                    ${ options ? `<p class="itemoptions">${options}</p>` : ''}
                    <div class="itemimgwrapper">
                        ${image ? `
                    <div class="itemimage" style="background-image:url(https://www.munchthai.com/assets/images/${image})">
                        <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fwww.munchthai.com%2Fmenu%2F${image.split('.')[0]}.html&layout=button&size=small&width=59&height=20&appId" width="59" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
                    </div>` : ''}
                        ${featured ? `<p class="itemfeatured">FEATURED</p>` : ''}
    `

}

function changeList() {
    document.getElementById('saved').classList.remove('saved')
    document.getElementById('item-list-output').innerHTML = document.getElementById('item-list-input').value
}

function addItem() {
    // create blank item form and preview
    const item = {}
    const iIndex = document.getElementsByClassName('item-form').length
    let itemForm = document.createElement('div')
    itemForm.id = `row-${iIndex}`
    itemForm.className = 'row align-items-center'
    itemForm.innerHTML = itemFormHtml(item, iIndex)
    document.getElementById('detailed-items').appendChild(itemForm)

    updatePreview(iIndex)
    window.scrollTo({
        top: document.getElementById(`item-${iIndex}-form`).offsetParent.offsetTop,
        left: 0,
        behavior: 'smooth'
    });
}

function deleteItem(event) {
    const iIndex = event.target.id.split('-')[2]
    if (confirm("Delete Item?")) {

    }
}
function save(){
    document.getElementById('saved').classList.add('saved')
    event.preventDefault()
    const tab = tabSel.value
    const sect = sectSel.value
    menuEdit[tab].disclaimer = document.getElementById('tab-disclaimer-input').value
    menuEdit[tab].sections[sect]["section title"] = document.getElementById('section-title-input').value
    menuEdit[tab].sections[sect]["section details"] = document.getElementById('section-details-input').value

    for (let i = 0; i < document.getElementsByClassName('item-form').length; i++) {
        menuEdit[tab].sections[sect]["section items"][i] = {
            name: document.getElementById(`item-${i}-name`).value,
            description: document.getElementById(`item-${i}-description`).value,
            image: document.getElementById(`item-${i}-image`).value,
            price: parseFloat(document.getElementById(`item-${i}-price`).value),
            extras: document.getElementById(`item-${i}-extras`).value,
            options: document.getElementById(`item-${i}-options`).value,
            featured: document.getElementById(`item-${i}-featured`).checked,
            vegan: document.getElementById(`item-${i}-vegan`).checked,
            vegetarian: document.getElementById(`item-${i}-vegetarian`).checked,
            "gf option": document.getElementById(`item-${i}-glutenoption`).checked,
        }
    }
    menuEdit[tab].sections[sect]['section list'] = document.getElementById('item-list-input').value

    fetch('/menu', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(menuEdit)
    })
        .then(r => {
            console.log(r)
        })
        .catch(e => { console.error(e) })
}
