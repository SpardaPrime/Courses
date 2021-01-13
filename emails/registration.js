module.exports = function(email,pass,name){
    return {
        to: email,
        from:'AksenenkoRoman93@protonmail.com',
        subject:'Account was created',
        html:`
        <h1 style="color:green">Thank you ${name} for registration on our website</h1>
        <h2>You success  created your account</h2>
        <h4>Your email for enter website : ${email}</h4>
        <h4>Your password for enter website: ${pass} </h4>
        <h6>Don't tell anybody this password</h6>
        <a href="http://localhost:3000/authorization#test1">WebSite</a>
        `
    }
}