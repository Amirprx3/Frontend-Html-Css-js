document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', ()=>({
        users: [],
        pageUsers: [],
        isloading: false,
        showAddModal: false,
        pageCount: 1,
        itemsCount: 4,
        currentPage: 1,
        getUsers(){
            this.isloading = true 
            axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                this.users = res.data
                this.pagination()

            }).finally(()=>{
                this.isloading = false

            })
        },
        pagination(){
            this.pageCount = Math.ceil(this.users.length / this.itemsCount) // 10 / 4 = 3
            const end = this.currentPage * this.itemsCount // 4
            const start = (this.currentPage * this.itemsCount) - this.itemsCount // 0
            this.pageUsers = this.users.slice(start , end)
            console.log(this.pageUsers)
        },
        
        nextPage(){
            this.currentPage++
            if(this.currentPage > this.pageCount) this.currentPage = this.pageCount
            this.pagination()
        },
    
        prevPage(){
            this.currentPage--
            if(this.currentPage < 1) this.currentPage = 1
            this.pagination()
        }
    }))
})