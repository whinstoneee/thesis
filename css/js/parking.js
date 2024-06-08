// Функция для отображения списка машиномест
function renderParkingSpaces(spaces) {
    const parkingList = document.getElementById('filterContent');
    parkingList.innerHTML = '';

    spaces.forEach(space => {
        const spaceItem = document.createElement('div');
        spaceItem.classList.add('parking-space');

        spaceItem.innerHTML = `
            <img src="${space.image}" alt="${space.name}">
            <h3>${space.name}</h3>
            <p>Площадь: ${space.square}</p>
            <p>Стоимость: ${space.cost} P</p>
            <p>Объект: ${space.zone}</p>
        `;

        parkingList.appendChild(spaceItem);
    });
}

// Функция для фильтрации машиномест по заданным критериям
function filterParkingSpaces() {
    const zone = document.getElementById('zone').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('price-max').value) || Infinity;
    const minArea = parseFloat(document.getElementById('area-min').value) || 0;
    const maxArea = parseFloat(document.getElementById('area-max').value) || Infinity;

    const filteredSpaces = DATA.filter(space => {
        return (zone === '' || space.zone.toLowerCase() === zone) &&
               (space.cost >= minPrice && space.cost <= maxPrice) &&
               (space.area >= minArea && space.area <= maxArea);
    });

    renderParkingSpaces(filteredSpaces);
}

// Функция для сортировки машиномест по цене и объекту
function sortParkingSpaces() {
    const zone = document.getElementById('zone').value.toLowerCase();
    const sortOrder = document.getElementById('filter-sort').value;

    let sortedSpaces = DATA.slice().filter(space => {
        return zone === '' || space.zone.toLowerCase() === zone;
    });

    if (sortOrder === '1') {
        sortedSpaces.sort((a, b) => a.cost - b.cost);
    } else if (sortOrder === '2') {
        sortedSpaces.sort((a, b) => b.cost - a.cost);
    }

    renderParkingSpaces(sortedSpaces);
}

// Функция для очистки фильтров
function clearFilters() {
    document.getElementById('zone').value = '';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('area-min').value = '';
    document.getElementById('area-max').value = '';
    document.getElementById('filter-sort').value = '0';

    renderParkingSpaces(DATA);
}

// Функция для переключения видимости формы фильтров
function toggleVisibility() {
    const filtersForm = document.getElementById('filters');
    filtersForm.classList.toggle('visible');
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filters').addEventListener('submit', function(event) {
        event.preventDefault();
        filterParkingSpaces();
    });

    document.getElementById('filter-sort').addEventListener('change', function() {
        sortParkingSpaces();
    });

    document.getElementById('clear-filters').addEventListener('click', function(event) {
        event.preventDefault();
        clearFilters();
    });

    // Отображение изначального списка при загрузке страницы
    renderParkingSpaces(DATA);
});
