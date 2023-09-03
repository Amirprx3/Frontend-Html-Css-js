document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', ()=>({
        mainUsers: [],
        users: [],
        pageUsers: [],
        isloading: false,
        showAddModal: false,
        pageCount: 1,
        itemsCount: 4,
        currentPage: 1,
        searchChar:"",
        newUserInfo:{
            name:"",
            username:"",
            email:"",
        },
        userIdToEdit: null,
        getUsers(){
            this.isloading = true 
            axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                this.users = res.data
                this.mainUsers = res.data
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
        },
        handleChangesItemsCount(value){
            this.currentPage = 1
            if (value < 1) this.itemsCount = 1
            if (value > this.users.length) this.itemsCount = this.users.length
        },
        handleSearch(value){
            this.users = this.mainUsers .filter(user=>(user.name.includes(value) || user.
            username.includes(value) || user.email.includes(value)))
            this.currentPage = 1
            this.pagination()
        },
        handleSubmitAddUserForm(){
            this.isloading = true
            axios.post("https://jsonplaceholder.typicode.com/users" , this.newUserInfo)
            .then((res)=>{
                if (res.status == 201){
                    this.mainUsers.push(res.data)
                    this.showAddModal = false
                    this.handleResetForm()
                    this.pagination()
                    M.toast({html:'کاربر با موفقیت ایجاد شد!', classes: 'green'});
                }
            }).finally(()=>{
                this.isloading = false
            })
        },
        handleResetForm(){
            this.newUserInfo = {
                name:"",
                username:"",
                email:"",
            }
        },
        handleDeleteUser(user){
            var toastHTML = `<span> مطمئنید که می خواهید (${user.name}) حذف شود؟</span><button class="btn-flat botton-Delete" x-on:click="handleConfrimDeleteUser(${user.id})">حذف</button>`
            M.toast({html: toastHTML});
        },
        handleConfrimDeleteUser(userName){
            
            this.isloading = true
            axios.delete("https://jsonplaceholder.typicode.com/users/"+userName,).then((res)=>{
                if (res.status == 200){
                    this.mainUsers = this.mainUsers.filter(user=>user.id != userName)
                    this. users = this.users.filter(user=>user.id != userName)
                    this.pagination()
                    M.toast({html:'کاربر حذف شد!', classes: 'green'});

                }
            }).finally(()=>{
                this.isloading = false
            })
        },
        handleUpdateUser(user){
            axios.get("https://jsonplaceholder.typicode.com/users/"+user.id).then(res=>{
                if (res.status == 200) {
                    this.newUserInfo = {
                        name:res.data.name,
                        username:res.data.username,
                        email:res.data.email,
                    }
                    this.userIdToEdit = res.data.id
                }
            })
            this.showAddModal = true
        },
        handleConfirmEditUser(){    
            this.isloading = true
            axios.put("https://jsonplaceholder.typicode.com/users/"+this.userIdToEdit , this.newUserInfo).then((res)=>{
                if (res.status == 200){
                    const userIndex = this.mainUsers.findIndex(user=>user.id = this.userIdToEdit)
                    this.mainUsers[userIndex] = res.data
                    this.showAddModal = false
                    this.handleResetForm()
                    this.userIdToEdit = null
                    this.pagination()
                    M.toast({html:'تغییرات با موفقیت اعمال شد!', classes: 'green'});
                }
            }).finally(()=>{
                this.isloading = false
            })  
        }
    }))
})