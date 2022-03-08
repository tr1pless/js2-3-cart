const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     window.ActiveXObject -> xhr = new ActiveXObject()
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === 4){
//             if(xhr.status !== 200){
//                 console.log('Error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     };
//     xhr.send();
// };

class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];//массив товаров из JSON документа
        this._getProducts()
            .then(data => { //data - объект js
                 this.goods = data;
//                 console.log(data);
                 this.render()
            });
    }
    // _fetchProducts(cb){
    //     getRequest(`${API}/catalogData.json`, (data) => {
    //         this.goods = JSON.parse(data);
    //         console.log(this.goods);
    //         cb();
    //     })
    // }
    _getProducts(){
      
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
       
    }
    cartVisibility(){
        const cartDiv = document.querySelector('.cart')
        if(cartDiv.style.display != 'block'){
            cartDiv.style.display = 'block';
        } else {
            cartDiv.style.display = 'none';
        }
    }
    cartAdd(a){
        fetch('https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json')
            .then(text => text.json())
            .then(data => {
                if(a != 0){
                    document.querySelector('.cart').insertAdjacentHTML('afterbegin', `<div class="cart-mouse">${data.contents[a].product_name} Price:${data.contents[a].price}$<button class="delete-btn"></button></div>`);
                }else{
                    document.querySelector('.cart').insertAdjacentHTML('afterbegin', `<div class="cart-notebook">${data.contents[a].product_name} Price:${data.contents[a].price}$<button class="delete-btn"></button></div>`);
                }
                    let num = +document.querySelector('.cart-total').textContent;
                    document.querySelector('.cart-total').textContent = num + data.contents[a].price
        })
    }

    cartRemove(){
     event.target.closest('div').remove();
     if(!event.target.closest('div').classList.contains('cart-mouse')){
        let num = +document.querySelector('.cart-total').textContent;
        document.querySelector('.cart-total').textContent = num - 45600;
     } else {
        let num = +document.querySelector('.cart-total').textContent;
        document.querySelector('.cart-total').textContent = num - 1000;
     }
    }
    // calcSum(){
    //     return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    // }
    calcSum(){
        
    }
    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
//            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }

    }
}


class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
    }
}

let list = new ProductsList();


document.querySelector('header').addEventListener('click', event => {
    const cartBtn = document.querySelector('.btn-cart');
    if(!event.target.classList.contains('btn-cart')){
        return;
    }
    list.cartVisibility();
})

document.querySelector('body').addEventListener('click', event => {
    if(!event.target.classList.contains('buy-btn')){
    return;
} else {
    if(event.target.closest('.product-item').dataset.id != '123'){
        list.cartAdd(1);
    } else {
        list.cartAdd(0);
    }
}
})

document.querySelector('.cart').addEventListener('click', event => {
    if(!event.target.classList.contains('delete-btn')){
        return;
    }
    list.cartRemove();
})