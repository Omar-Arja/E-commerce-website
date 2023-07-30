const pages = {}

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

// login page
pages.page_index = () => {
    const login_email = document.querySelector('#login-email')
    const login_password = document.querySelector('#login-password')
    const login_btn = document.querySelector('#login-btn')

    login_btn.addEventListener('click', () => {
        if (login_email.value != '' && login_password.value != '') {
            login_btn.innerHTML = 'Loading...'
            const data = new FormData()
            data.append('email', login_email.value)
            data.append('password', login_password.value)
            
        }
    })
}

// signup page
pages.page_signup = () => {
    const signup_name = document.querySelector('#signup-name')
    const signup_email = document.querySelector('#signup-email')
    const signup_password = document.querySelector('#signup-password')
    const signup_confirm_password = document.querySelector('#signup-confirm-password')
    const signup_btn = document.querySelector('#signup-btn')

    signup_btn.addEventListener('click', () => {
        if (signup_name.value != '' && signup_email.value != '' && signup_password.value != '' && signup_confirm_password.value != '' && signup_password.value == signup_confirm_password.value) {
            signup_btn.innerHTML = 'Loading...'
            const data = new FormData()
            data.append('name', signup_name.value)
            data.append('email', signup_email.value)
            data.append('password', signup_password.value)

        } else {
            signup_btn.innerHTML = 'Sign Up'
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

// click on navbar links
pages.clickedLink = () => {
    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', () => {
            let id = item.id
            pages.activeLink(id)
            clicked_page = id.split('-')[1]
            console.log(clicked_page)
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