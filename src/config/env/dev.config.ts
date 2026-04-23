export default ()=>({
    port:process.env.PORT,
    db:{
        url:process.env.DB_URL
    },
    google:{
        clientId:process.env.GOOGLE_CLIENT_ID
    },
    jwt:{
        secretKey:process.env.JWT_SECRET_KEY
    }
})