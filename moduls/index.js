const productoDOM = document.querySelector(".productos__center")
const carritoDOM = document.querySelector(".carrito")
const carritoCenter = document.querySelector(".carrito__center")
const openCarrito = document.querySelector(".carrito__icon")
const closeCarrito = document.querySelector(".close__carrito")
const overlay = document.querySelector("carrito__overlay")
const carritoTotal = document.querySelector(".carrito__total")
const clearCarritoBtn = document.querySelector(".clear__carrito")
const itemTotales = document.querySelector(".item__total")
const searchBar = document.getElementById('buscar')
let carrito = []
let buttonDOM = []



class UI{
  renderProductos(productos){
    let result = ""
    productos.forEach( producto => {
      
      result += `
      <div class="producto">
      <div class="image__container">
      <img src=${producto.image} alt="">
    </div>
        <div class="producto__footer">
          <h1>${producto.title}</h1>
          <div class="rating">
            <span>
              <i class="bx bxs-star"></i>
            </span>
            <span>
              <i class="bx bxs-star"></i>
            </span>
            <span>
              <i class="bx bxs-star"></i>
            </span>
            <span>
              <i class="bx bxs-star"></i>
            </span>
            <span>
              <i class="bx bx-star"></i>
            </span>
          </div>
          <div class="price">$${producto.price}</div>
        </div>
        <div class="bottom">
          <div class="btn_group">
            <a href="" class="btn addToCart" data-id=${producto.id}>Añadir Carrito</a>
          </div>
        </div>
      </div>
    </div>
      `
    });
    productoDOM.innerHTML =result
  }

 


  getButtons(){
    const buttons = [...document.querySelectorAll(".addToCart")]
    buttonDOM = buttons
    buttons.forEach( button =>{
      const id = button.dataset.id
      const inCart = carrito.find(item => item.id === parseFloat(id, 10))

      if(inCart){
        button.innerHTML = "En el carrito"
        button.disabled = true
      }
      button.addEventListener("click", e =>{
        e.preventDefault()
        e.target.innerHTML = "En el carrito"
        e.target.disabled = true

        //GET productos al carrito 
        const carritoItem = {...Storage.getProductos(id), cantidad: 1}

        //agregamos el producto al carrito 
        carrito = [...carrito, carritoItem]

        //Guardamos el carrito al localStorage
        Storage.saveCart(carrito)

        //set cart values
        this.setItemValues(carrito)
        this.addCarritoItem(carritoItem)
        //show al carrito
      })
    })
  }
  setItemValues(carrito){
    let tempTotal = 0 
    let itemTotal = 0
    carrito.map(item =>{
      tempTotal += item.price * item.cantidad
      itemTotal += item.cantidad
    })
    carritoTotal.innerText = parseFloat(tempTotal.toFixed(2))
    itemTotales.innerText = itemTotal
  }

  addCarritoItem({image,price,title,id}){
    const div = document.createElement("div")
    div.classList.add("carrito__item")

    div.innerHTML = `
    <img src=${image} alt=${title} />
    <div>
      <h3>${title}</h3>
      <p class="price">$${price}</p>
    </div>
    <div>
      <span class="increase" data-id=${id}>
        <i class="bx bxs-up-arrow"></i>
      </span>
      <p class+"item__cantidad">1</p>
      <span class="decrease" data-id=${id}>
        <i class="bx bxs-down-arrow"></i>
      </span>
    </div>
    <div>
      <span class="remove__item" data-id=${id}>
        <i class="bx bx-trash"></i>
      </span>
    </div>
    `
    carritoCenter.appendChild(div)
  }
  show(){
    carritoDOM.classList.add("show")
    overlay.classList.add("show")
  }
  hide(){
    carritoDOM.classList.remove("show")
    overlay.classList.remove("show")
  }
  setAPP(){
    carrito = Storage.getCart()
    this.setItemValues(carrito)
    this.pouplate(carrito)

    openCarrito.addEventListener("click",this.show)
      closeCarrito.addEventListener("click", this.hide)
  }
  pouplate(carrito){
    carrito.forEach(item => this.addCarritoItem(item))
  }
  cartLogic(){
    clearCarritoBtn.addEventListener("click", ()=>{
      this.clearCarrito()
      this.hide()
    })
    carritoCenter.addEventListener("click", e =>{
      const target = e.target.closest("span")
      const targeElement = target.classList.contains("remove__item")

      if(!target) return
      if(targeElement){
        const id = parseInt(target.dataset.id)
        this.removeItem(id)
        carritoCenter.removeChild(target.parentElement.parentElement)
      }else if(target.classList.contains("increase")){
        const id = parseInt(target.dataset.id, 10)
        let tempItem = carrito.find(item => item.id === id)
        tempItem.cantidad++
        Storage.saveCart(carrito)
        this.setItemValues(carrito)
        target.nextElementSibling.innerText = tempItem.cantidad

      }else if(target.classList.contains("decrease")){
        const id = parseInt(target.dataset.id, 10)
        let tempItem = carrito.find(item => item.id === id)
        tempItem.cantidad--

        if(tempItem.cantidad > 0){
          Storage.saveCart(carrito)
          this.setItemValues(carrito)
          target.previousElementSibiling.innerText = tempItem.cantidad
        }else{
          this.removeItem(id)
          carritoCenter.removeChild(target.parentElement.parentElement)
        }
      }
    })
  }
  clearCarrito(){
    const cartItems = carrito.map(item => item.id)
    cartItems.forEach(id => this.removeItem(id))

    while(carritoCenter.children.length > 0){
      carritoCenter.removeChild(carritoCenter.children[0])
    }
  }
  removeItem(id){
    carrito = carrito.filter(item => item.id !== id)
    this.setItemValues(carrito)
    Storage.saveCart(carrito)
    let button = this.singleButton(id)
    if(button){
      button.disabled = false 
      button.innerText = "añadir carrito"
    }
  }
  singleButton(id){
    return buttonDOM.find(button => parseInt(button.dataset.id) === id)
  }
}



class Storage{
  static saveProduct(obj){
    localStorage.setItem("productos", JSON.stringify(obj))
  }
  static saveCart(carrito){
    localStorage.setItem("carrito",JSON.stringify(carrito))
  }
  static getProductos(id){
    const producto = JSON.parse(localStorage.getItem("productos"))
    return producto.find(product => product.id === parseFloat(id, 10))
  }
  static getCart(){
    return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem('carrito')) : []
  }
}

class Productos {
  async getProductos(){
    try{
      const result = await fetch("/moduls/productos.json")
      const data = await result.json()
      const productos = data.items
      return productos
    }catch(err){
      console.log(err)
    }
  }
}


let category = ""
let productos = []

function categoryValue(){
  const ui = new UI()

  category = document.getElementById("category").value
  if(category.length > 0){
    const producto = productos.filter(regx => regx.category === category)
    ui.renderProductos(producto)
  }else{
    ui.renderProductos(productos)
  }
}



searchBar.addEventListener('keyup', (e) => {
  const ui = new UI()
  const searchString = e.target.value.toLowerCase();

  const producto = productos.filter((producto) => {
      return (
          producto.title.toLowerCase().includes(searchString) ||
          producto.category.toLowerCase().includes(searchString)
      );
  });
  ui.renderProductos(producto)
});



document.addEventListener("DOMContentLoaded", async () =>{
  const productosLista = new Productos();
  const ui = new UI()

  ui.setAPP()

  productos = await productosLista.getProductos()
  ui.renderProductos(productos)
  Storage.saveProduct(productos)
  ui.getButtons()
  ui.cartLogic()
})






