function toggleVisibility() {
    const filtersForm = document.getElementById('filters');
    filtersForm.classList.toggle('visible');
}

let allData = [];

    // Проверяем наличие массива DATA_APARTMENTS
    if (typeof DATA_APARTMENTS !== 'undefined' && DATA_APARTMENTS.length > 0) {
        allData = [...allData, ...DATA_APARTMENTS];
    }

    // Проверяем наличие массива DATA_PARKING
    if (typeof DATA_PARKING !== 'undefined' && DATA_PARKING.length > 0) {
        allData = [...allData, ...DATA_PARKING];
    }

document.addEventListener('DOMContentLoaded', function() {
    const filters = document.getElementById('filters');
    const goodsContainer = document.getElementById('goods');
    const showButton = document.querySelector('.form__info-link');
    const clearButtonContainer = document.getElementById('clear-filters-container');
    const clearButton = document.getElementById('clear-filters');

    function renderGoods(data, container) {
        container.innerHTML = '';
        data.forEach(item => {
            const goodDiv = document.createElement('div');
            goodDiv.classList.add('card__content-index');
            goodDiv.dataset.zone = item.zone;
            goodDiv.dataset.size = item.size;
            goodDiv.dataset.price = item.cost;
            goodDiv.dataset.area = item.area;

            goodDiv.innerHTML = `
                <div class="card__title">
                    <h3 class="filter__card-title">${item.name}</h3>
                    <button class="favorite-button" data-id="${item.id}"><img src="./img/heart.svg" alt="Add to favorites"></button>
                </div>
                <div class="card__img">
                    <img class="filter__card-img" src="${item.image}" alt="${item.name}">
                </div>
                <div class="card__text">
                    <p class="filter__card-price">${item.cost} млн P</p>
                    <p class="filter__card-flat">${item.flat!== undefined? item.flat : ''}</p>
                    <p class="filter__card-area">Площадь: ${item.area} м2</p>
                </div>
                
            `;
            container.appendChild(goodDiv);
            setTimeout(() => {
                goodDiv.classList.add('visible');
            }, 0);
        });

        container.querySelectorAll('.favorite-button').forEach(button => {
            button.addEventListener('click', addToFavorite);
        });

        container.querySelectorAll('.remove-favorite-button').forEach(button => {
            button.addEventListener('click', removeFromFavorite);
        });
        if (typeof DATA_APARTMENTS !== 'undefined' && DATA_APARTMENTS.length > 0) {
            renderGoods(DATA_APARTMENTS, goodsContainer);
        } else {
            console.log('No DATA_APARTMENTS found.');
        }
    
        // Вывод данных массива DATA_PARKING
        if (typeof DATA_PARKING !== 'undefined' && DATA_PARKING.length > 0) {
            renderGoods(DATA_PARKING, goodsContainer);
        } else {
            console.log('No DATA_PARKING found.');
        }
    }

    function filterGoods(event) {
        if (event) event.preventDefault();
    
        const zone = document.getElementById('zone').value;
        const sizeCheckboxes = document.querySelectorAll('#size .btn:checked');
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;
        const areaMin = document.getElementById('area-min').value;
        const areaMax = document.getElementById('area-max').value;
        const sortOption = document.getElementById('filter-sort').value;
    
        const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);
        const priceMinNum = priceMin ? parseInt(priceMin, 10) : null;
        const priceMaxNum = priceMax ? parseInt(priceMax, 10) : null;
        const areaMinNum = areaMin ? parseInt(areaMin, 10) : null;
        const areaMaxNum = areaMax ? parseInt(areaMax, 10) : null;
    
        let filteredData = DATA.filter(item => {
            let isVisible = true;
    
            if (zone && item.zone !== zone) {
                isVisible = false;
            }
    
            if (sizes.length > 0 && !sizes.includes(item.size)) {
                isVisible = false;
            }
    
            if (priceMinNum !== null && item.cost < priceMinNum) {
                isVisible = false;
            }
    
            if (priceMaxNum !== null && item.cost > priceMaxNum) {
                isVisible = false;
            }
    
            if (areaMinNum !== null && item.area < areaMinNum) {
                isVisible = false;
            }
    
            if (areaMaxNum !== null && item.area > areaMaxNum) {
                isVisible = false;
            }
    
            return isVisible;
        });
    
        if (sortOption === '1') { // Сначала дешевле
            filteredData.sort((a, b) => a.cost - b.cost);
        } else if (sortOption === '2') { // Сначала дороже
            filteredData.sort((a, b) => b.cost - a.cost);
        }
    
        renderGoods(filteredData, goodsContainer);
    
        const isAnyFilterUsed = zone || sizes.length > 0 || priceMin || priceMax || areaMin || areaMax;
        clearButtonContainer.style.display = isAnyFilterUsed ? 'block' : 'none';
    
        if (filteredData.length === 0) {
            goodsContainer.classList.add('hidden');
        } else {
            goodsContainer.classList.remove('hidden');
        }
    }

    

    function clearFilters(event) {
        event.preventDefault();
        filters.reset();
        goodsContainer.classList.add('hidden');
        clearButtonContainer.style.display = 'none';
    }

   function addToFavorite(event) {
    console.log("Adding to favorite...");
    console.log("Event Target:", event.currentTarget);
    console.log("Event Target Dataset:", event.currentTarget.dataset);
    console.log("Event Target Dataset ID:", event.currentTarget.dataset.id);
    
    const itemName = event.currentTarget.dataset.id.trim();
    if (!itemName) {
        console.log("Item Name is empty. Aborting...");
        return; // Проверка на наличие данных
    }

    const itemId = parseInt(event.currentTarget.dataset.id, 10);
    let favoriteItems = getFavoriteItems();
    if (!favoriteItems.includes(itemName)) {
        favoriteItems.push(itemId);
        setFavoriteItems(favoriteItems);
        updateFavoriteGoods();
        console.log('Favorite Items:', favoriteItems);
    }
    console.log('Favorite Items:', favoriteItems);
}

    function removeFromFavorite(event) {
        const itemName = event.target.dataset.id;
        let favoriteItems = getFavoriteItems();
        favoriteItems = favoriteItems.filter(item => item !== itemName);
        setFavoriteItems(favoriteItems);
        updateFavoriteGoods();
    }

    function getFavoriteItems() {
        const favoriteCookie = getCookie('favorite');
        return favoriteCookie ? JSON.parse(favoriteCookie) : [];
    }

    function setFavoriteItems(items) {
        setCookie('favorite', JSON.stringify(items), 30); // Save for 30 days
    }

    function updateFavoriteGoods() {
        const favoriteContainer = document.getElementById('favorite-goods');
        if (!favoriteContainer) return; // Вернуться, если контейнер не найден

        const favoriteItems = getFavoriteItems();
        const favoriteData = DATA.filter(item => favoriteItems.includes(item.name));
        renderGoods(favoriteData, favoriteContainer);
        favoriteContainer.classList.toggle('hidden', favoriteData.length === 0);
    }

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(row => row.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }

    if (showButton) {
        showButton.addEventListener('click', filterGoods);
    }
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }

    const favoriteGoodsContainer = document.getElementById('favorite-goods');
    if (favoriteGoodsContainer) {
        favoriteGoodsContainer.classList.add('hidden');
        updateFavoriteGoods();
    }
    filterGoods();
});


document.addEventListener('DOMContentLoaded', function() {
    const favoriteContainer = document.getElementById('favorite-goods');
    const favoriteCountElement = document.getElementById('favorite-count');

    function renderFavoriteGoods() {
        const favoriteItems = getFavoriteItems();
        const favoriteData = DATA.filter(item => favoriteItems.includes(item.name));
        favoriteContainer.innerHTML = '';
        
        if (favoriteData.length === 0) {
            favoriteContainer.innerHTML = '<p class="favourite-text">Еще не добавлено ни одной квартиры или машиноместа</p>';
            return;
        }

        favoriteData.forEach(item => {
            const goodDiv = document.createElement('div');
            goodDiv.classList.add('single-goods');
            goodDiv.dataset.zone = item.zone;
            goodDiv.dataset.size = item.size;
            goodDiv.dataset.price = item.cost;
            goodDiv.dataset.area = item.area;

            goodDiv.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}">
                <p>Стоимость: ${item.cost} млн P</p>
                <p>Площадь: ${item.area} м2</p>
                <button class="remove-favorite-button" data-id="${item.name}">Удалить из избранного</button>
            `;
            favoriteContainer.appendChild(goodDiv);
        });

        favoriteContainer.querySelectorAll('.remove-favorite-button').forEach(button => {
            button.addEventListener('click', removeFromFavorite);
        });
    }

    function getFavoriteItems() {
        const cookies = document.cookie.split('; ');
        const favoriteCookie = cookies.find(row => row.startsWith('favorite='));
        return favoriteCookie ? JSON.parse(decodeURIComponent(favoriteCookie.split('=')[1])) : [];
    }

    function setFavoriteItems(items) {
        const encodedItems = encodeURIComponent(JSON.stringify(items));
        document.cookie = `favorite=${encodedItems}; path=/; max-age=${60*60*24*30}`;
    }

    function removeFromFavorite(event) {
        const itemName = event.target.dataset.id;
        let favoriteItems = getFavoriteItems();
        favoriteItems = favoriteItems.filter(item => item !== itemName);
        setFavoriteItems(favoriteItems);
        updateFavoriteCount();
        renderFavoriteGoods();
    }

    function updateFavoriteCount() {
        const favoriteItems = getFavoriteItems();
        if (favoriteCountElement) {
            favoriteCountElement.textContent = favoriteItems.length;
        }
    }

    if (favoriteContainer) {
        renderFavoriteGoods();
    }
    
    updateFavoriteCount();
});