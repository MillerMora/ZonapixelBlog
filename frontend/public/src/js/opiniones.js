const API_URL = "http://localhost:3000/api/opiniones";

fetch(API_URL).then(response => response.json()).then(datos =>{

        const opinionesContainer = document.querySelector('.row.g-4');
        opinionesContainer.innerHTML = '';

        datos.datos.forEach(opinion => {
            const opinionElement = document.createElement('div');
            opinionElement.className = 'col-md-6 col-lg-3';
            opinionElement.innerHTML = `
                <div class="review-card">
                    <a href="opinion.html?id=${opinion.id_opinion}" class="review-card-link text-decoration-none">
                        <div class="user-info">
                            <div class="user-avatar">${opinion.nombre_usuario.charAt(0).toUpperCase()}</div>
                            <strong>${opinion.nombre_usuario}</strong>
                        </div>
                        <h6>${opinion.titulo}</h6>
                        <p class="small text-muted mb-2">${opinion.nombre_categoria || 'Categoría'} | ${opinion.nombre_juego || 'Juego'}</p>
                        <div class="stars">
                            ${generateStars(opinion.calificacion)}
                        </div>
                        <p class="small">${opinion.contenido.substring(0, 100)}...</p>
                    </a>
                </div>
            `;
            opinionesContainer.appendChild(opinionElement);
        });

}).catch(error => {
    console.error('Error al cargar las opiniones:', error);
});

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}
