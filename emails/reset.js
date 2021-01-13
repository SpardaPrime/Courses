module.exports= function(email, token){
    return{
        to:email,
        from:'AksenenkoRoman93@protonmail.com',
        subject:'Restore access',
        html:`
        <h1>Did you forget password?</h1>
        <p><a href="http://localhost:3000/authorization/reset/${token}">Restore access</a></p>
        <p>If didnt, please ignore this message</p>

        `
    }
}