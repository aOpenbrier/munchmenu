let menuEdit
const tabSel = document.getElementById('menutabselect')
const sectSel = document.getElementById('menusectionselect')
const savedSpan = document.getElementById('unsaved')
const saveBtn = document.getElementById('save-btn')
const undoBtn = document.getElementById('undo-btn')
const formsContainer = document.getElementById('forms-container')

function sourceSelect(event) {
    // API route passed as select El value
    const source = event.target.value
    if (source) {
        tabSel.innerHTML = ''
        sectSel.innerHTML = ''
        formsContainer.innerHTML = ''

        // get list of menu tabs
        fetch(source)
            .then(r => r.json())
            .then(r => {
                tabSel.removeAttribute('disabled')
                menuEdit = r
                // create placeholder option with no value
                let tabplaceholder = document.createElement('option')
                tabplaceholder.value = ''
                tabplaceholder.innerText = 'Select a Menu Tab'
                tabplaceholder.setAttribute('selected', true)
                tabSel.appendChild(tabplaceholder)
                // populate select with options
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
        sectSel.removeAttribute('disabled')
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
    // Create tab disclaimer form
    if (sectSel.value) {
        let tabForm = document.createElement('div')
        tabForm.className = 'row align-items-center added'
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

        // Create section editing forms
        let sectionForm = document.createElement('div')
        sectionForm.className = 'row align-items-center added'
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
                <textarea name="details" id="section-details-input" rows="${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section details"] ? '2' : '1'}" class="w-100 form-control" placeholder="e.g. Rice is not included. Please order separately.">${menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section details"] || ""}</textarea>
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
            itemsHead.id = 'detailed-header'
            itemsHead.className = 'row'
            itemsHead.innerHTML = '<div class="col-6"><h3>Detailed Items:</h3></div><div class="col-6"> <a class="text-white btn btn-primary" onclick="addItem()">Add Item</a></div>'
            formsContainer.appendChild(itemsHead)
            // create container for detailed items
            let detailedItems = document.createElement('div')
            detailedItems.id = 'detailed-items'
            formsContainer.appendChild(detailedItems)

            // create forms and previews for each detailed menu item
            menuEdit[tabSel.value].sections[parseInt(sectSel.value)]["section items"].forEach((item, index) => {
                let itemForm = itemFormHtml(item, index)
                itemForm.classList.add('added')
                document.getElementById('detailed-items').appendChild(itemForm)
                updatePreview(index)
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
                    <textarea name="list" id="item-list-input" rows="5" class="w-100 form-control" placeholder="e.g. Coke | $1.75<br> Mexican Coke | $2.75" $>${sectionList || ""}</textarea>
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

function itemFormHtml(item, index) {
    let itemForm = document.createElement('div')
    itemForm.id = `row-${index}`
    itemForm.className = 'row align-items-center'

    itemForm.innerHTML = `
                <div class="col-6">
                <div class="rounded border shadow mb-3 p-2 bg-white">
                    <form id="item-${index}-form" class="item-form" oninput="changeItem(${index})">
                    <div class="form-group">
                        <label for="item-${index}-name">Name: </label>
                        <input type="text" name="name" id="item-${index}-name" class="w-100 form-control" value="${item.name || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${index}-description">Description: </label>
                        <textarea name="description" id="item-${index}-description" rows="${item.description ? '2' : '1'}" class="w-100 form-control">${item.description || ""}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="item-${index}-price">Image: </label>
                        <input type="text" name="image" id="item-${index}-image" class="w-100 form-control" value="${item.image || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${index}-price">Price: </label>
                        <input type="number" name="price" id="item-${index}-price" class="w-100 form-control" value="${item.price || ""}">
                    </div>

                    <div class="form-group">
                        <label for="item-${index}-extras">Extras: </label>
                        <textarea name="extras" id="item-${index}-extras" rows="${item.extras ? '3' : '1'}" class="w-100 form-control" placeholder="e.g. Chicken $14 Beef $15">${item.extras || ""}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="item-${index}-options">Options: </label>
                        <textarea name="options" id="item-${index}-options" rows="${item.options ? '3' : '1'}" class="w-100 form-control" placeholder="e.g. Options: soft tofu, cripsy tofu, mixed veggies" >${item.options || ""}</textarea>

                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="item-${index}-featured">Featured: </label>
                                <input type="checkbox" name="featured" id="item-${index}-featured" ${item.featured ? "checked" : ""} >
                            </div>

                            <div class="form-group">
                                <label for="item-${index}-glutenoption">Gluten Free Option: </label>
                                <input type="checkbox" name="glutenoption" id="item-${index}-glutenoption" ${item["gf option"] ? "checked" : ""}>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="item-${index}-vegan">Vegan: </label>
                                <input type="checkbox" name="vegan" id="item-${index}-vegan" ${item.vegan ? "checked" : ""} >
                            </div>

                            <div class="form-group">
                                <label for="item-${index}-vegetarian">Vegetarian: </label>
                                <input type="checkbox" name="vegetarian" id="item-${index}-vegetarian" ${item.vegetarian ? "checked" : ""} >
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <a class="btn btn-danger text-white" id="item-delete-${index}" onclick="deleteItem(event)">Delete</a>
                        </div>
                    </div>
                </form>
                </div>
                </div>
                <div class="col-6">
                <div class="menu shadow mb-3">
                <div id="item-${index}-output" class="sectionitem">

                </div>
                </div>
                </div>
                `
    return itemForm
}

function itemFormValues(i) {
    return {
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

function changeDisclaimer() {
    savedStatus(false)
    document.getElementById('tab-disclaimer-output').innerHTML = document.getElementById('tab-disclaimer-input').value
}

function changeSection() {
    // enable "save" button and update preview
    savedStatus(false)
    document.getElementById('section-title-output').innerHTML = document.getElementById('section-title-input').value
    document.getElementById('section-details-output').innerHTML = document.getElementById('section-details-input').value
}

function changeItem(index) {
    savedStatus(false)
    updatePreview(index)
}

function updatePreview(index) {
    const item = itemFormValues(index)

    document.getElementById(`item-${index}-output`).innerHTML = `
    ${item.price ? `<p class="itemprice">${`${item.price.toString().split('.')[1] ? item.price.toFixed(2) : item.price}`}</p>` : ''}
                    ${item.name ? `<h5 class="itemname">${item.name}</h5>` : ''}
                    ${item.description ? `<p class="itemdesc">${item.description}</p>` : ''}
                    ${item['gf option'] ? `<p class="itemdietary">*Gluten-free optional</p>` : ''}
                    ${item.vegan ? `<p class="itemdietary">*Vegan</p>` : ''}
                    ${item.vegetarian ? `<p class="itemdietary">*Vegetarian</p>` : ''}
                    ${item.extras ? `<p class="itemextras">${item.extras}</p>` : ''}
                    ${item.options ? `<p class="itemoptions">${item.options}</p>` : ''}
                    <div class="itemimgwrapper">
                        ${item.image ? `
                    <div class="itemimage" style="background-image:url(https://www.munchthai.com/assets/images/${item.image})">
                        <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fwww.munchthai.com%2Fmenu%2F${item.image.split('.')[0]}.html&layout=button&size=small&width=59&height=20&appId" width="59" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
                    </div>` : ''}
                        ${item.featured ? `<p class="itemfeatured">FEATURED</p>` : ''}
    `
}

function changeList() {
    savedStatus(false)
    document.getElementById('item-list-output').innerHTML = document.getElementById('item-list-input').value
}

function addItem() {
    savedStatus(false)
    // shift index of any following forms + 1
    const numForms = document.getElementsByClassName('item-form').length
    if (numForms){
        for (let i = numForms - 1 ; i >= 0; i--){
            const item = itemFormValues(i)
            let itemForm = itemFormHtml(item, i + 1)
            document.getElementById('detailed-items').insertBefore(itemForm, document.getElementById(`row-${i + 2}`) )
            document.getElementById(`row-${i}`).parentNode.removeChild(document.getElementById(`row-${i}`))
            updatePreview(i + 1)
        }
    }
    // create blank item form and preview pane as first child
    const noItem = {}
    let newItemForm = itemFormHtml(noItem, 0)
    newItemForm.classList.add('added')
    document.getElementById('detailed-items').insertBefore(newItemForm, document.getElementById('row-1'))
    updatePreview(0)
    document.getElementById(`item-0-name`).focus()
    document.getElementById('detailed-header').scrollIntoView()
}

function deleteItem(event) {
    const index = parseInt(event.target.id.split('-')[2])
    const elem = document.getElementById(`row-${index}`)
    if (confirm("Delete Item?")) {
        savedStatus(false)
        // animate row height to 50%
        const originalHt = elem.clientHeight
        function reduceHt() {
            elem.style.height = (elem.clientHeight - (originalHt / 20)) + 'px'
        }
        let setInt = setInterval(reduceHt, 20)

        // Delay for animation
        setTimeout(() => {
            clearInterval(setInt)
            // delete selected form row
            elem.parentNode.removeChild(elem)
            if (index < document.getElementsByClassName('item-form').length) {
                // shift index of any following forms -1
                for (let i = index + 1; i <= document.getElementsByClassName('item-form').length; i++) {
                    const item = itemFormValues(i)

                    document.getElementById(`row-${i}`).parentNode.removeChild(document.getElementById(`row-${i}`))
                    let itemForm = itemFormHtml(item, i - 1)
                    document.getElementById('detailed-items').appendChild(itemForm)
                    updatePreview(i - 1)
                }
            }
        }, 400, elem, index)

    }
}
function savedStatus(isSaved){
    // indicate if saved. enable/disable save/undo buttons, section selection
    if (isSaved){
        savedSpan.classList.add('saved')
        saveBtn.setAttribute('disabled', true)
        undoBtn.setAttribute('disabled', true)
        tabSel.removeAttribute('disabled')
        sectSel.removeAttribute('disabled')
    } else {
        savedSpan.classList.remove('saved')
        saveBtn.removeAttribute('disabled')
        undoBtn.removeAttribute('disabled')
        tabSel.setAttribute('disabled', true)
        sectSel.setAttribute('disabled', true)
        document.getElementById('menusourceselect').setAttribute('disabled', true)
    }
}

function save() {
    savedStatus(true)
    event.preventDefault()
    const tab = tabSel.value
    const sect = sectSel.value
    menuEdit[tab].disclaimer = document.getElementById('tab-disclaimer-input').value
    menuEdit[tab].sections[sect]["section title"] = document.getElementById('section-title-input').value
    menuEdit[tab].sections[sect]["section details"] = document.getElementById('section-details-input').value

    for (let i = 0; i < document.getElementsByClassName('item-form').length; i++) {
        menuEdit[tab].sections[sect]["section items"][i] = itemFormValues(i)
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

function undo(){
    if (confirm('Undo will only undo changes since last save. To start over, refresh page and select source "web"')) {        
        sectionSelect()
        savedStatus(true)
    }
}
