document.addEventListener('DOMContentLoaded', function() {
    const favoriteContainer = document.getElementById('favorite-goods');
    const favoriteCountElement = document.getElementById('favorite-count');

    function renderFavoriteGoods() {
        const favoriteItems = getFavoriteItems();
        const favoriteData = window.DATA.filter(item => favoriteItems.includes(item.id));
        favoriteContainer.innerHTML = '';
        
        if (favoriteData.length === 0) {
            favoriteContainer.innerHTML = '<p class="favourite-text">Еще не добавлено ни одной квартиры или машиноместа</p>';
            return;
        }

        favoriteData.forEach(item => {
            const goodDiv = document.createElement('div');
            goodDiv.classList.add('card__content-index');
            goodDiv.dataset.zone = item.zone;
            goodDiv.dataset.size = item.size;
            goodDiv.dataset.price = item.cost;
            goodDiv.dataset.area = item.area;

            goodDiv.innerHTML = `
            
            <div class="card__title">
                    <h3 class="filter__card-title">${item.name}</h3>
                    <button class="remove-favorite-button" data-id="${item.id}">
                        <img class="black-heart" src="./img/black-heart.svg">
                    </button>
                </div>
                <div class="card__img">
                    <img class="filter__card-img" src="${item.image}" alt="${item.name}">
                </div>
                <div class="card__text">
                    <p class="filter__card-price">${item.cost} P</p>
                     <p class="filter__card-flat">${item.flat !== undefined ? item.flat : ''}</p>
                    <p class="filter__card-area">Площадь: ${item.area} м2</p>
                </div>
            `;
            favoriteContainer.appendChild(goodDiv);
        });

        favoriteContainer.querySelectorAll('.remove-favorite-button').forEach(button => {
            button.addEventListener('click', removeFromFavorite);
            console.log('click');
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
        const itemId = parseInt(event.target.closest('button').dataset.id, 10);
        let favoriteItems = getFavoriteItems();
        favoriteItems = favoriteItems.filter(item => item !== itemId);
        setFavoriteItems(favoriteItems);
        updateFavoriteCount();
        renderFavoriteGoods();
    }

    function addToFavorite(event) {
        const itemId = parseInt(event.currentTarget.dataset.id, 10);
        let favoriteItems = getFavoriteItems();
        if (!favoriteItems.includes(itemId)) {
            favoriteItems.push(itemId);
            setFavoriteItems(favoriteItems);
            updateFavoriteCount();
            renderFavoriteGoods();
        }
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

    // Подключаем событие для кнопок добавления в избранное
    document.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', addToFavorite);
    });
});
