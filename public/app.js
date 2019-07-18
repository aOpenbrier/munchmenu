let menuEdit

function sourceSelect(event){
    if (event && event.target.value) {
        document.getElementById('menu-selection').innerHTML = `
                    <div class="form-group row mx-2">
                        <label for="menutabselect" class="col-4 col-form-label ">Menu Tab: </label>
                        <select name="tab" id="menutabselect" class='form-control col-8' onchange="tabSelect(event)">
                        </select>
                    </div>
                    <div class="form-group row mx-2 mb-0">
                        <label for="menusectionselect" class="col-4 col-form-label">Section: </label>
                        <select name="section" id="menusectionselect" class="form-control col-8" onchange="sectionSelect(event)">
                        </select>
                    </div>`
        let tabplaceholder = document.createElement('option')
        tabplaceholder.value = ''
        tabplaceholder.innerText = 'Select a Menu Tab'
        tabplaceholder.setAttribute('selected', true)
        document.getElementById('menutabselect').appendChild(tabplaceholder)

        console.log(event.target.value)
        fetch(event.target.value)
            .then(r => r.json())
            .then(r => {
                menuEdit = r

                r.forEach((tab, tabIndex) => {
                    let taboption = document.createElement('option')
                    taboption.value = tabIndex
                    taboption.innerText = tab.id
                    document.getElementById('menutabselect').appendChild(taboption)
                })
            })
            .catch(e => console.log(e))
    }
}

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
        menuEdit[event.target.value].sections.forEach((section, sIndex) => {
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
        tabForm.className = 'row align-items-center'
        tabForm.innerHTML = `
        <div class="col-6">
        <div class="rounded border shadow mb-3 p-2 bg-white">
        <form id="disclaimer-form" oninput="changeDisclaimer()">
            <div class="form-group">
                <label for="tab-disclaimer-input">Menu Disclaimer: </label>
                <textarea name="details" id="tab-disclaimer-input" rows="${menuEdit[event.target.dataset.tab].disclaimer ? '2' : '1'}" class="w-100 form-control">${menuEdit[event.target.dataset.tab].disclaimer || ""}</textarea>
            </div>
            <small>*Displayed at the bottom of current menu tab, after all sections</small>
        </form>
        </div>
        </div>
        <div class="col-6">
        <div class="menu shadow mb-3">
        <div id="tab-disclaimer-output" class="menudisclaimer">
        ${menuEdit[event.target.dataset.tab].disclaimer || ""}
        </div>
        </div>
        </div>
        `
        document.getElementById('forms-container').appendChild(tabForm)

        // section editing forms
        let sectionForm = document.createElement('div')
        sectionForm.className = 'row align-items-center'
        sectionForm.innerHTML = `
        <div class="col-6">
        <div class="rounded border shadow mb-3 p-2 bg-white">
        <form id="section-form" oninput="changeSection()">
            <div class="form-group">
                <label for="section-title-input">Section Title: </label>
                <input type="text" name="title" id="section-title-input" class="w-100 form-control" value="${menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section title"] || ""}">
            </div>
            <div class="form-group">
                <label for="section-details-input">Section Details: </label>
                <textarea name="details" id="section-details-input" rows="${menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section details"] ? '2' : '1'}" class="w-100 form-control">${menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section details"] || ""}</textarea>
            </div>
        </form>
        </div>
        </div>
        <div class="col-6">
        <div class="menu shadow mb-3">
        <h3 id="section-title-output" class="sectiontitle">${menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section title"]}</h3>
        <p id="section-details-output" class="sectiondetails">${menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section details"] || ""}</p>
        </div>
        </div>
        `
        document.getElementById('forms-container').appendChild(sectionForm)

        
        // list forms for menu-items
        if (menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"]){
        let itemsH = document.createElement('h3')
        itemsH.innerText = "Detailed Items:"
        document.getElementById('forms-container').appendChild(itemsH)

        menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"].forEach((item, iIndex) => {

            let itemForm = document.createElement('div')
            itemForm.className = 'row align-items-center'
            itemForm.innerHTML = `
                <div class="col-6">
                <div class="rounded border shadow mb-3 p-2 bg-white">
                    <form id="item-${iIndex}-form" data-item="${iIndex}" class="item-form" oninput="changeItem(${iIndex})">
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
                <div id="item-${iIndex}-output" class="sectionitem">
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
                    <div class="itemimage" style="background-image:url(https://www.munchthai.com/assets/images/${item.image})">
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
        let sectionList = menuEdit[event.target.dataset.tab].sections[parseInt(event.target.value)]["section list"]
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
        document.getElementById('forms-container').appendChild(listedItemsForm)
    }
}

function changeDisclaimer(){
    document.getElementById('saved').classList.remove('saved')
    document.getElementById('tab-disclaimer-output').innerHTML = document.getElementById('tab-disclaimer-input').value
}

function changeSection(){
    document.getElementById('saved').classList.remove('saved')
    document.getElementById('section-title-output').innerHTML = document.getElementById('section-title-input').value
    document.getElementById('section-details-output').innerHTML = document.getElementById('section-details-input').value
}

function changeItem(index){
    document.getElementById('saved').classList.remove('saved')
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

function changeList(){
    document.getElementById('saved').classList.remove('saved')
    document.getElementById('item-list-output').innerHTML = document.getElementById('item-list-input').value
}

function save(){
    document.getElementById('saved').classList.add('saved')
    event.preventDefault()
    const tab = document.getElementById('menusectionselect').dataset.tab
    const sect = document.getElementById('menusectionselect').value
    menuEdit[tab].disclaimer = document.getElementById('tab-disclaimer-input').value
    menuEdit[tab].sections[sect]["section title"] = document.getElementById('section-title-input').value
    menuEdit[tab].sections[sect]["section details"] = document.getElementById('section-details-input').value

    for (let i = 0; i < document.getElementsByClassName('item-form').length; i++){
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
