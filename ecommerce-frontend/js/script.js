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

// Login page
pages.page_index = () => {
    
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
            eval(`pages.page_${clicked_page}()`)
        })
    })
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