const pages = {}


pages.base_url = 'http://127.0.0.1:8000/api/'

pages.loadFor = (page) => {
    eval(`pages.page_${page}()`)
}

// home page
pages.page_dashboard = () => {
    pages.showSection('home')
    pages.activeLink('nav-home')
    pages.navbar()
    pages.clickedLink()
    document.querySelector('.redirect').addEventListener('click', () => {
        pages.page_products()
    })



}

// products tab
pages.page_products = () => {
    pages.showSection('products')
    pages.activeLink('nav-products')


}

pages.page_cart = () => {
    pages.showSection('cart')
    pages.activeLink('nav-cart')
    pages.cartQuantity()

}

// login page
pages.page_index = () => {
    const login_email = document.querySelector('#login-email')
    const login_password = document.querySelector('#login-password')
    const login_btn = document.querySelector('#login-btn')

    login_btn.addEventListener('click', () => {
        if (login_email.value != '' && login_password.value != '') {
            login_btn.innerHTML = 'Loading... <span></span>'
            const data = new FormData()
            data.append('email', login_email.value)
            data.append('password', login_password.value)

            fetch(`${pages.base_url}auth/login`, {
                method: 'POST',
                body: data,
                redirect: 'follow'
            }).then(response => response.json())
                .then(data => {
                    if (data.status == 'success') {
                        login_btn.innerHTML = 'Success'
                        setTimeout(() => {window.location.href = 'dashboard.html'}, 2000)
                        localStorage.setItem('token', data.authorisation.token)
                    } else {
                        login_btn.innerHTML = 'Failed'
                        setTimeout(() => {login_btn.innerHTML = 'Login'}, 2000)
                    }
                }
                ).catch(error => {
                    login_btn.innerHTML = 'Failed'
                    setTimeout(() => {login_btn.innerHTML = 'Login'}, 2000)
                }
                )

        }
        else {
            console.log("else")
            login_btn.innerHTML = 'Failed'
            setTimeout(() => {login_btn.innerHTML = 'Login'}, 2000)
        }
    })
}

// signup page
pages.page_signup = () => {
    console.log('signup')
    const signup_name = document.querySelector('#signup-name')
    const signup_email = document.querySelector('#signup-email')
    const signup_password = document.querySelector('#signup-password')
    const signup_confirm_password = document.querySelector('#signup-confirm-password')
    const signup_type = document.getElementById('signup-checkbox')
    const signup_btn = document.querySelector('#signup-btn')

    signup_type.addEventListener('change', () => {
        if (signup_type.checked) {
            signup_type.value = 'admnin'
        } else {
            signup_type.value = 'buyer'
        }
    })

    signup_btn.addEventListener('click', (event) => {
        event.preventDefault()
        console.log("clicked")
        if (signup_name.value != '' && signup_email.value != '' && signup_password.value != '' && signup_confirm_password.value != '' && signup_password.value == signup_confirm_password.value) {
            signup_btn.innerHTML = 'Loading...'
            const data = new FormData()
            data.append('name', signup_name.value)
            data.append('email', signup_email.value)
            data.append('password', signup_password.value)
            data.append('type', signup_type.value)

            fetch(`${pages.base_url}auth/register`, {
                method: 'POST',
                body: data,
                redirect: 'follow'
            }).then(response => response.json())
                .then(data => {
                    if (data.status == 'success') {
                        signup_btn.innerHTML = 'Success'
                        setTimeout(() => {window.location.href = 'index.html'}, 2000)
                    } else {
                        signup_btn.innerHTML = 'Failed'
                        setTimeout(() => {signup_btn.innerHTML = 'Sign Up'}, 2000)
                    }
                }
                ).catch(error => {
                    signup_btn.innerHTML = 'Failed'
                    setTimeout(() => {signup_btn.innerHTML = 'Sign Up'}, 2000)
                }
                )

        } else {
            signup_btn.innerHTML = 'Failed'
            setTimeout(() => {signup_btn.innerHTML = 'Sign Up'}, 2000)
        }

    })
}


// navbar
pages.navbar = () => {
    window.onscroll = () => {
        if (window.scrollY > 50) {
            document.querySelector('header').classList.add('bg-body')
        } else {
            document.querySelector('header').classList.remove('bg-body')
        }
    }
}

// cart quantity functionality
pages.cartQuantity = () => {
    const cart_item_quantity = document.querySelector('.cart-item-quantity');
    const input_field = cart_item_quantity.querySelector('.cart-item-quantity-input');
    const increase_btn = cart_item_quantity.querySelector('[data-action="increase"]');
    const decrease_btn = cart_item_quantity.querySelector('[data-action="decrease"]');

    increase_btn.addEventListener('click', () => {
        input_field.stepUp();
    });

    decrease_btn.addEventListener('click', () => {
        if (input_field.value > 1) {
            input_field.stepDown();
        }
    });

    input_field.addEventListener('input', () => {
        if (input_field.value <= 0) {
            input_field.value = 1;
        }
    });
}

// click on navbar links
pages.clickedLink = () => {
    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.id
            pages.activeLink(id)
            clicked_page = id.split('-')[1]
            eval(`pages.page_${clicked_page}()`)
        })
    })
}
pages.page_home = () => {
    pages.page_dashboard()
}

// add active class to clicked link
pages.activeLink = (page) => {
    nav_items = document.querySelectorAll('.nav-link')
    nav_items.forEach(item => {
        item.classList.remove('active-link')
    })
    document.querySelector(`#${page}`).classList.add('active-link')
}

// hide all sections except chosen section
pages.showSection = (section) => {
    document.querySelectorAll('section').forEach(item => {
        item.classList.add('d-none')
    })
    document.querySelector(`#${section}`).classList.remove('d-none')
}