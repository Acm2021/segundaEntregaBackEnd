const { stringify } = require('querystring');


class ProductManager{
    static #ultimoIdEvento = 1
    
    constructor(){
        this.products = [];
        this.path = 'products.json'; //default
    
    }   
    
    
    #getNuevoId() {
        const id = ProductManager.#ultimoIdEvento
        ProductManager.#ultimoIdEvento++
        return id
    }
    
    #codeVerificationOk(codeToVerify) {
        let codeOK = true;
        this.products.forEach(product => {
            if (product.code === codeToVerify) {
                codeOK = false;
            }
        });
        return codeOK; 
    }
    
    changePath(){
        this.path = prompt("Ingrese nuevo Path");
    }

    async readingFile(path){
        const fs= require ('fs')    
        
        
        try{
            const contentFile= await fs.promises.readFile(path,'utf-8')
            if(contentFile.trim === ''){
                return
            }
            else {this.products= JSON.parse(contentFile)}
        }
            catch (err){
                console.log("Archivo no encontrado o vacío")
            
            }
    }

    async writingFile(path,content){
        const fs= require ('fs')    
        
        
        try{
            const contentFileToWrite = JSON.stringify(content,null,'\t')
            await fs.promises.writeFile(path,contentFileToWrite)
            
        }
            catch (err){
                console.log("No se ha podido escribir")
            
            }
    }




    async addProduct(title, description, price,thumbnail,code,stock ){
        await this.readingFile(this.path)        
        const product = {
            id: this.#getNuevoId(),
            title: title ?? throwError("title es nulo"),
            description: description ?? throwError("description es nulo"),
            price: price ?? throwError("price"),
            thumbnail: thumbnail ?? throwError("thumbnail es nulo"),
            code: code ?? throwError("code es nulo"),
            stock: stock ?? throwError("stock es nulo")
        };
        if(this.#codeVerificationOk(code)){
            this.products.push(product);
            await this.writingFile(this.path,this.products)
        }
        else{console.log("codigo repetido")}
        
    }

    getProducts(){
        this.readingFile(this.path)   
        return this.products;    
    }

    getProductById(idBuscado) {
        this.readingFile(this.path)
        for (const product of this.products) {
            if (product.id === idBuscado) {
                console.log("Found:", product);
                return product; 
            }
        }
    
        console.log("Not found");
        return null;  
    }

    async DeleteProductById(idToEliminate) {
        await this.readingFile(this.path)
        const indexToEliminate =this.products.findIndex((product)=>product.id === idToEliminate)
        if(indexToEliminate !== -1){
            this.products.splice(indexToEliminate,1)
            this.writingFile(this.path,this.products)
        }
        else{console.log("Not found index to delete");
        return null;  }                           
        }
        
}


//TEST 
main()
const instancia = new ProductManager();

instancia.addProduct("Mi_prodcuto","Descripción", 20.99, "imagen.jpg", "ABC123", 50);
instancia.addProduct("Mi_prodcuto2","Descripción2", 20.992, "imagen2.jpg", "ABC1232", 50);
instancia.addProduct("Mi_prodcuto3","Descripción3", 20.992, "imagen2.jpg", "ABC1236", 50);
instancia.DeleteProductById(2)

/*
instancia.getProducts();
instancia.getProductById(4)*/

