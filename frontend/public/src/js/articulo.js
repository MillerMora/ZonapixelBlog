const API_URL = "http://localhost:3000/api/articulos";

fetch(API_URL).then(response => {
    return response.json();
}).then(datos => {

    const articulosContainer = document.getElementById('articulos-container');
    const pagination = articulosContainer.querySelector('.pagination').parentElement;

    articulosContainer.innerHTML = '';
    articulosContainer.appendChild(pagination);

    if (datos.data && datos.data.length > 0) {
        datos.data.forEach(articulo => {
            const articleElement = document.createElement('article');
            articleElement.className = 'article-item';
            articleElement.innerHTML = `
                <a href="articulo.html?id=${articulo.id_articulo}" class="article-link">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${articulo.imagen_principal || 'https://thumbs.dreamstime.com/b/sello-del-ejemplo-28420393.jpg'}" alt="${articulo.titulo}" class="article-img">
                        </div>
                        <div class="col-md-8">
                            <div class="article-content">
                                <h3>${articulo.titulo}</h3>
                                <p>${articulo.contenido.substring(0, 200)}...</p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            articulosContainer.insertBefore(articleElement, pagination);
        });
    }

}).catch(error => {
    console.error('Error al cargar los artículos:', error);
});
