const pages = {}


pages.base_url = 'http://127.0.0.1:8000/api/'

const user_header = { Authorization: `Bearer ${localStorage.getItem('token')}` }


class Product {
    constructor(id, name, price, image_url, description, color, category) {
        this.id = id
        this.name = name
        this.price = price
        this.image_url = image_url
        this.description = description
        this.color = color.charAt(0).toUpperCase() + color.slice(1)
        this.category = category.charAt(0).toUpperCase() + category.slice(1)
    }

    displayProductCard() {
        return `<div class="product-card" id="${this.id}">
        <img src="${this.image_url}" alt="product image" class="product-img">
        <div class="product-inner">
            <div class="product-content">
                <div class="front-card">
                <div class="product-info">
                    <h3 class="product-title">${this.color}</h3>
                    <span class="product-price">$${this.price}</span>
                </div>
                </div>
                <div class="back-card">
                    <p class="product-description"><span class="product-category">${this.category}</span><br>${this.description}</p>
            </div>
        </div>  
    </div>
    <div class="product-buttons">
        <button class="button-add icon favorite">
            <img src="../assets/images/heart.svg" alt="heart icon">
          </button>
        <button class="button-add icon cart" onclick="addToCart(${this.id})">
          <img src="../assets/images/shopping-bag-line.svg" alt="shopping bag icon">
        </button>
    </div>
</div>`
    }


}

class Cart {
    constructor(id, product_id, name, image_url, price, quantity) {
        this.id = id
        this.product_id = product_id
        this.name = name
        this.image_url = image_url
        this.price = price
        this.quantity = quantity
    }

    displayCartItem() {
        return `<div class="cart-item" id="${this.product_id}">
        <div class="cart-item-left">
            <img src="${this.image_url}" alt="product image"  class="cart-item-img">
            <h3 class="cart-item-title">${this.name}</h3>
        </div>
        <div class="cart-item-right">
            <div class="cart-item-quantity">
                <button type="button" class="cart-item-quantity-btn" data-action="decrease">-</button>
                <input type="number" class="cart-item-quantity-input" value="${this.quantity}">
                <button type="button" class="cart-item-quantity-btn" data-action="increase">+</button>
            </div>
            <div class="cart-item-price">$${this.price}</div>
            <button type="button" class="remove-btn cart-remove-item" onclick="removeFromCart(${this.product_id})">
                Remove Item
            </button>
        </div>
    </div>`
    }

}

pages.loadFor = (page) => {
    eval(`pages.page_${page}()`)
}

// home page
pages.page_dashboard = () => {
    if (localStorage.getItem('type') == 'buyer') {
        document.getElementById('admin-panel').style.display = 'none'
    }
    pages.showSection('home')
    pages.activeLink('nav-home')
    pages.navbar()
    pages.clickedLink()
    document.querySelector('.redirect').addEventListener('click', () => {
        pages.page_products()
    })



}


let products = []

// products tab
pages.page_products = () => {
    pages.showSection('products')
    pages.activeLink('nav-products')
    document.querySelector('.products-container').innerHTML = ''
    products = []


    fetch(`${pages.base_url}products/`, {
        method: 'GET'
    }).then(response => response.json())
        .then((data) => {
            data.products.forEach(product => {
                product = new Product(product.id,
                    product.name,
                    product.price,
                    product.image_url,
                    product.description,
                    product.color,
                    product.category_id)

                products.push(product)
                document.querySelector('.products-container').innerHTML += product.displayProductCard()
            })
        }).catch(error => console.log(error))

}

let cart_items = []
// cart tab
pages.page_cart = () => {
    pages.showSection('cart')
    pages.activeLink('nav-cart')
    pages.updateCart()


}

pages.page_panel = () => {
    pages.showSection('panel')
    pages.activeLink('nav-panel')
    pages.navbar()
    pages.clickedLink()


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
                        localStorage.clear()
                        localStorage.setItem('token', data.authorisation.token)
                        localStorage.setItem('type', data.type)
                        setTimeout(() => { window.location.href = 'dashboard.html' }, 2000)
                    } else {
                        login_btn.innerHTML = 'Failed'
                        setTimeout(() => { login_btn.innerHTML = 'Login' }, 2000)
                    }
                }
                ).catch(error => {
                    login_btn.innerHTML = 'Failed'
                    setTimeout(() => { login_btn.innerHTML = 'Login' }, 2000)
                }
                )

        }
        else {
            login_btn.innerHTML = 'Failed'
            setTimeout(() => { login_btn.innerHTML = 'Login' }, 2000)
        }
    })
}

// signup page
pages.page_signup = () => {
    const signup_name = document.querySelector('#signup-name')
    const signup_email = document.querySelector('#signup-email')
    const signup_password = document.querySelector('#signup-password')
    const signup_confirm_password = document.querySelector('#signup-confirm-password')
    const signup_type = document.getElementById('signup-checkbox')
    const signup_btn = document.querySelector('#signup-btn')
    signup_type.value = 'buyer'

    signup_type.addEventListener('change', () => {
        if (signup_type.checked) {
            signup_type.value = 'admin'
        } else {
            signup_type.value = 'buyer'
        }
    })

    signup_btn.addEventListener('click', (event) => {
        event.preventDefault()
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
                        setTimeout(() => { window.location.href = 'index.html' }, 2000)
                    } else {
                        signup_btn.innerHTML = 'Failed'
                        setTimeout(() => { signup_btn.innerHTML = 'Sign Up' }, 2000)
                    }
                }
                ).catch(error => {
                    signup_btn.innerHTML = 'Failed'
                    setTimeout(() => { signup_btn.innerHTML = 'Sign Up' }, 2000)
                }
                )

        } else {
            signup_btn.innerHTML = 'Failed'
            setTimeout(() => { signup_btn.innerHTML = 'Sign Up' }, 2000)
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

    function increaseQuantity() {
        input_field.stepUp();
    }

    function decreaseQuantity() {
        if (input_field.value > 1) {
            input_field.stepDown();
        }
    }

    function checkInput() {
        if (input_field.value <= 0) {
            input_field.value = 1;
        }
    }

    increase_btn.removeEventListener('click', increaseQuantity);
    decrease_btn.removeEventListener('click', decreaseQuantity);
    input_field.removeEventListener('input', checkInput);

    increase_btn.addEventListener('click', increaseQuantity);
    decrease_btn.addEventListener('click', decreaseQuantity);
    input_field.addEventListener('input', checkInput);
}

pages.page_home = () => {
    pages.page_dashboard()
}

// click on navbar links
pages.clickedLink = () => {
    document.querySelectorAll('.nav-link').forEach(item => {
        item.removeEventListener('click', handleLinkClick)
        item.addEventListener('click', handleLinkClick)
    })
}

// handle click events on navbar links
function handleLinkClick() {
    const id = this.id
    pages.activeLink(id)
    clicked_page = id.split('-')[1]
    console.log(clicked_page)
    eval(`pages.page_${clicked_page}()`)
}

// add to cart
function addToCart(id) {
    const data = new FormData()
    data.append('product_id', id)
    fetch(`${pages.base_url}cart/`, {
        method: 'POST',
        headers: user_header,
        body: data,
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                console.log("product added to cart", data)
            }
        }
        ).catch(error => {
            console.log(error)
        })

}

// remove from cart
function removeFromCart(id) {
    document.getElementById(`${id}`).remove()
    fetch(`${pages.base_url}cart/${id}`, {
        method: 'DELETE',
        headers: user_header,
        redirect: 'follow'
    }).then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                document.getElementById(`${id}`).remove()
                console.log("product removed from cart", data)
            }
        }).catch(error => {
            console.log(error)
        })
}

// update cart
pages.updateCart = () => {
    document.querySelector('.cart-items-container').innerHTML = ''

    cart_items = []

    fetch(`${pages.base_url}cart/`, {
        method: 'GET',
        headers: user_header
    })
        .then(response => response.json())
        .then((data) => {
            data.cart_items.forEach(item => {
                item = new Cart(item.id, item.product_id, item.name, item.image_url, item.price, item.quantity)
                cart_items.push(item)
                document.querySelector('.cart-items-container').innerHTML += item.displayCartItem()
                pages.cartQuantity()
            })
        }).catch(error => console.log(error))
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