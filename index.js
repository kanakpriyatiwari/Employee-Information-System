let express = require("express");
let server = express();
let mysql = require("mysql")  
let cors = require('cors'); // Adding CORS 
let path=require("path");
let session=require("express-session");
const { count } = require("console");

server.set("view engine", "ejs")
server.use(session({secret:"abcde",resave:true,saveUninitialized:true}))
//server.use(express.static("public"));
server.use(express.static("public"));
console.log("path => ",path.resolve("./public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors()); //  CORS for all routes

server.get("/form",(req,res)=>{

    res.sendFile(path.resolve("./public")+"/inputdata.html");
})

    
server.get("/inputdata",(req,res)=>{
    let c=0;
    let data=[]
    if(req.session.count==undefined)
        {
            c=0;
            data=[];
        }
    else
        {
            c=req.session.count
    data=req.session.data
        }    

    c++
    data.push(req.query.uname);    

    req.session.count=c;
    req.session.data=data;
    //console.log(req.sessionID)
    //console.log(req.session)
    res.send(req.query.uname+" count=" + c+" , "+data);
})
//  ////
server.get("/ab",(req,res)=> {
    req.session.username = "RAM..."
    res.send("session is set")
});

/// 
server.get("/get_session",(req,res)=>{
    res.send("session username is " +req.session.username)
})
   

let c = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'classwork'
})

c.connect(function (err) {
    if (!err) {
        console.log("sql connected...");
    }
    else {
        console.log("not connected..");
    }
})

// HOMEPAGE WELCOME
server.get("/", (req, res) => {
    
});

// SHOW EMP
server.get("/showEmp", (req, res) => {
    c.query("SELECT * FROM emp", (err, result) => {
        if (err) {
            console.log(err.message);

        } else {
            res.render("showemp", { data: result })
        }
    });
})

// INSERT PAGE WILL COME
server.get("/insertEmp", (req, res) => {
    //res.sendFile(__dirname+"\\public\\insertemp.html")
    res.sendFile(path.resolve("./public")+"/insertemp.html")
});

// INSERT DATA INTO DB
server.post("/insertEmp", (req, res) => {
    c.query("INSERT INTO emp (eno,ename,gender,city,designation,department,salary) VALUES(?,?,?,?,?,?,?)",[req.body.eno, req.body.ename, req.body.gen, req.body.city, req.body.designation, req.body.department, req.body.salary], (error, results) => {
        if (error)
                     throw error;
        
                 console.log("inserted..", results.affectedRows);
                  res.redirect("/")         
    })
})

// SEARCH   PAGE WILL COME
server.get("/searchEmp", (req, res) => {
    res.sendFile(path.resolve("./public")+"/searchEmp.html")
});


    // SEARCH EMPLOYEE BY ENO
server.post("/getdetails", (req, res) => {
    

    c.query("SELECT * FROM emp WHERE eno = ?", [req.body.eno], (err, result) => {
        if (err) {
            console.log(err.message);
            res.send("Error");
        } else {
            if (result.length === 0) {
                res.send("Employee not found");
            } else {
                res.render("searchresult", { data: result[0] });
            }
        }
    });
});


// UPDATE
// Assuming your update route is "/update"
server.post("/update", (req, res) => {
    if (req.body.b1 === "Update") {
        c.query(
 "UPDATE emp SET ename=?, gender=?, city=?, designation=?, department=?, salary=? WHERE eno=?",
[req.body.ename, req.body.gen, req.body.city, req.body.designation, req.body.department, req.body.salary, req.body.eno],
 (error, result) => {
                if (error) {
                    throw error;
                }

                console.log("updated..", result.affectedRows);
                res.redirect("/showEmp");
            }
        );
    } else if (req.body.b1 === "Delete") {
        c.query(
            "DELETE FROM emp WHERE eno=?",
            [req.body.eno],
            (error, results) => {
                if (error) {
                    throw error;
                }

                console.log("deleted..", results.affectedRows);
                res.redirect("/showEmp");
            }
        );
    }
});


// API FOR ALL EMP (JSON)----------
server.get("/apiemployees", (req, res) => {
    c.query("SELECT * FROM emp", (err, result) => {
        if (err) {
            console.log(err.message);
            
        } else {
            res.json(result);
        }
    });
});

//  (enosearch)----
server.post("/enosearch", (req, res) => {
    c.query("SELECT * FROM emp WHERE eno = ?", [req.body.eno], (err, result) => {
        if (err) {
            console.log(err.message);
            res.send("Error");
        } else {
            if (result.length === 0) {
                res.send("Employee not found");
            } else {
                res.json(result[0]); //  result will be in  JSON
            }
        }
    });
});




server.listen(4000, () => { console.log("server started at 4000!") })




