const API_URL = "http://localhost:3000/api/resenas";

fetch(API_URL).then(response => response.json()).then(datos =>{

        const resenas = datos.datos;

        const categorias = {};
        resenas.forEach(resena => {
            if (!categorias[resena.nombre_categoria]) {
                categorias[resena.nombre_categoria] = [];
            }
            categorias[resena.nombre_categoria].push(resena);
        });

        Object.keys(categorias).forEach(categoria => {
            const carouselId = getCarouselId(categoria);
            if (carouselId) {
                updateCarousel(carouselId, categorias[categoria]);
            }
        });

}).catch(error => {
    console.error('Error al cargar las reseñas:', error);
});

function getCarouselId(categoria) {
    const mapping = {
        'RPG': 'carouselRPG',
        'Shooters': 'carouselShooters',
        'Aventura': 'carouselAventura'
    };
    return mapping[categoria];
}

function updateCarousel(carouselId, resenas) {
    const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
    if (!carouselInner) return;
    carouselInner.innerHTML = '';

    for (let i = 0; i < resenas.length; i += 4) {
        const item = document.createElement('div');
        item.className = i === 0 ? 'carousel-item active' : 'carousel-item';

        const row = document.createElement('div');
        row.className = 'row g-4';

        resenas.slice(i, i + 4).forEach(resena => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-3';

            col.innerHTML = `
                <a href="resena.html?id=${resena.id_resena}" class="game-card-link">
                    <div class="game-card">
                        <img src="${resena.imagen_principal || 'https://cdn-icons-png.flaticon.com/512/5650/5650378.png'}" alt="${resena.nombre_juego}">
                        <div class="game-card-content">
                            <h5>${resena.nombre_juego}</h5>
                            <p>${resena.contenido.substring(0, 100)}...</p>
                        </div>
                    </div>
                </a>
            `;

            row.appendChild(col);
        });

        item.appendChild(row);
        carouselInner.appendChild(item);
    }
}
