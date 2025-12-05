const resenaAPI = "http://localhost:3000/api/resenas";
fetch(resenaAPI).then(response => response.json()).then(datos => {
    if (datos.datos && datos.datos.length > 0) {
        const resena = datos.datos[0];
        const card = document.querySelector('a[href="resena.html"]');
        if (card) {
            card.href = `resena.html?id=${resena.id_resena}`;
            const img = card.querySelector('img');
            if (img) img.src = resena.imagen_principal || 'https://upload.wikimedia.org/wikipedia/en/0/05/Final_Fantasy_VI.jpg';
            const title = card.querySelector('.card-title');
            if (title) title.textContent = `Reseña: ${resena.nombre_juego}`;
            const text = card.querySelector('.card-text');
            if (text) text.textContent = resena.contenido.substring(0, 100) + '...';
        }
    }
}).catch(error => {
});

const articuloAPI = "http://localhost:3000/api/articulos";
fetch(articuloAPI).then(response => response.json()).then(datos => {
    if (datos.data && datos.data.length > 0) {
        const articulo = datos.data[0];
        const card = document.querySelector('a[href="articulo.html"]');
        if (card) {
            card.href = `articulo.html?id=${articulo.id_articulo}`;
            const img = card.querySelector('img');
            if (img) img.src = articulo.imagen_principal || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1pGPlX3gVpIZJ7ePuP435AYemONatMxJ7DQ&s';
            const title = card.querySelector('.card-title');
            if (title) title.textContent = `Artículo: ${articulo.titulo}`;
            const text = card.querySelector('.card-text');
            if (text) text.textContent = articulo.contenido.substring(0, 100) + '...';
        }
    }
}).catch(error => {
});

const entrevistaAPI = "http://localhost:3000/api/entrevistas";
fetch(entrevistaAPI).then(response => response.json()).then(datos => {
    if (datos.datos && datos.datos.length > 0) {
        const entrevista = datos.datos[0];
        const card = document.querySelector('a[href="entrevista.html"]');
        if (card) {
            card.href = `entrevista.html?id=${entrevista.id_entrevista}`;
            const img = card.querySelector('img');
            if (img) img.src = entrevista.imagen_principal || 'https://i.ytimg.com/vi/WXhixDzluJI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDvJS7ys3n-e5ibgjRV8OrL9K31VQ';
            const title = card.querySelector('.card-title');
            if (title) title.textContent = `Entrevista: ${entrevista.titulo}`;
            const text = card.querySelector('.card-text');
            if (text) text.textContent = 'Descubre los secretos detrás del desarrollo...';
        }
    }
}).catch(error => {
});

const opinionesAPI = "http://localhost:3000/api/opiniones";
fetch(opinionesAPI).then(response => response.json()).then(datos => {
    const reviewCards = document.querySelectorAll('.review-card');
    if (reviewCards.length > 0) {
        datos.datos.slice(0, 4).forEach((opinion, index) => {
            if (reviewCards[index]) {
                const card = reviewCards[index];
                const link = card.querySelector('.review-card-link');
                if (link) {
                    link.href = `opinion.html?id=${opinion.id_opinion}`;
                    const avatar = link.querySelector('.user-avatar');
                    if (avatar) avatar.textContent = opinion.nombre_usuario.charAt(0).toUpperCase();
                    const name = link.querySelector('strong');
                    if (name) name.textContent = opinion.nombre_usuario;
                    const title = link.querySelector('h6');
                    if (title) title.textContent = opinion.titulo;
                    const category = link.querySelector('p.small.text-muted');
                    if (category) category.textContent = `Opinión | ${opinion.nombre_juego || 'Juego'}`;
                    const stars = link.querySelector('.stars');
                    if (stars) stars.innerHTML = generateStars(opinion.calificacion);
                    const content = link.querySelector('p.small:not(.text-muted)');
                    if (content) content.textContent = `"${opinion.contenido.substring(0, 100)}..."`;
                }
            }
        });
    }
}).catch(error => {
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
