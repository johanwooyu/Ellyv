var http = require("http")
var url = require("url")
var fs = require("fs")
var qs = require("querystring")
const port = process.env.PORT|| 3000;

function css(request, response) {
    if (request.url === "/style4.css") {
        response.writeHead(200, { "Content-type": "text/css" });
        var fileContents = fs.readFileSync("./style4.css", { encoding: "utf8" });
        response.write(fileContents);
        response.end();
    }
}

var shop = fs.readFileSync("./shop.html");
var aboutus = fs.readFileSync("./aboutus.html");

var server = http.createServer(function(request,response){
    css(request, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    var q = url.parse(request.url,true)
    if (q.pathname == "/" && request.method == "GET"){
        var keyword = q.query.keyword;
        if (keyword){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<h2>Pencarian</h2>");
            response.write("<p>Anda Mencari : <b>" + keyword + "</b> </p>");
            response.write("<h3><b></b>Tidak ada Hasil ! Maaf Website ini masih dalam tahap pengembangan</b></h3>");
            response.end("<a href='/'>Kembali</a>");
            
            }
        else{
            fs.readFile("index.html", function(error,data){
                if (error){
                    response.writeHead(404,{"Conten-Type": "text/html"});
                    response.end("404 Not Found");
                }
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(data)
            response.end();    
            });
        }
    }
    else if (request.url == '/shop'){
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(shop);
        response.end();
    }

    else if (request.url == '/aboutus'){
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(aboutus);
        response.end();
    }
 
 
    else if (request.url==="/login" && request.method === "GET"){
        fs.readFile("login.html",(error,data)=>{
            if (error){
                response.writeHead(404,{"Content-Type":"text/html"});
                return response.end("404 Server Not Found");                
            }
            else{
                response.writeHead(200, {"Content-Type":"text/html"});
                response.write(data)
                return response.end()
            }
        });
    }
    else if (request.url==="/login" && request.method === "POST"){
        var requestBody = "";
        request.on("data",function(data){
            requestBody += data;
        });
        request.on("end",function(){
            var formData = qs.parse(requestBody);
            if (formData.username === "mahasiswa" && formData.password === "admin"){
                response.writeHead(200,{"Content-Type":"text/html"});
                // response.write("<h2>Selamat Datang Mahasiswa SP 3.2</h2>");
                // response.write("<p>username : "+formData.username+"</p>");
                // response.write("<p>password : "+formData.password+"</p>");
                // response.write("<a href='/'>Kembali</a>");
                response.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Login</title>
                    <link rel="stylesheet" href="style4.css">
                </head>
                <body>
                    <ul class="navigasi">
                        <li>
                            <a href="/home">Home</a>
                        </li>
                        <li>
                            <a href="/shop">Shop</a>
                        </li>
                        <li>
                            <a href="#promo">Promo</a>
                        </li>
                        <li>
                            <a href="/aboutus">About Us</a>
                        </li>
                        <li>
                            <a href="/profil">Profil</a>
                        </li>
                    </ul>
                    <table class="tabel" align="center">
                        <tr>
                            <td><label for="username">Username  </label></td>
                            <td> : </td>
                            <td><p>${formData.username}</p></td>
                        </tr>
                        <tr>
                            <td><label for="namalengkap">Nama Lengkap  </label></td>
                            <td> : </td>
                            <td><p>Ellyv Septiana Eka P</p></td>
                        </tr>
                        <tr>
                            <td><label for="email">Email  </label></td>
                            <td> : </td>
                            <td><p>ellyvputri@gmail.com</p></td>
                        </tr>
                        <tr>
                            <td><label for="password">Password  </label></td>
                            <td> : </td>
                            <td><p>${formData.password}</p></td>
                        </tr>
                        <tr>
                            <td><label for="nohp">No.Handphone  </label></td>
                            <td> : </td>
                            <td><p>08978654362</p></td>
                        </tr>
                        <tr>
                            <td><label for="status">Status  </label></td>
                            <td> : </td>
                            <td><p>Mahasiswa</p></td>
                        </tr>
                    </table>
                </body>
                </html>
                `)
                response.end();
                }
            else{
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write("<h2>Login Gagal</h2>");
                response.write("<a href='/login'>Coba Kembali</a>");
                response.end();
            }
        });

    }
});


server.listen(port);
console.log("Server Berjalan");