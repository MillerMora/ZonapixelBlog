document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validate inputs
            if (!email || !password) {
                alert('Por favor, ingresa tu email y contraseña');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5230/api/Login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('¡Login exitoso! Bienvenido ' + (data.user ? data.user.name : ''));
                    // Store user session if needed
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // Redirect to home or dashboard
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'Email o contraseña incorrectos');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Verifica que el servidor esté funcionando.');
            }
        });
    }
});

