const express = require('express');
const app = express();
const fs = require('fs').promises;
const port = 3000;
const name = [
    {id: 1, name: "Andre Tolentino"}
];

setTimeout(() => {
    app.route("/callback")
        .get((rq, rs) => {
            console.log(rq.method, rq.url)
            rs.send(`Callback:\n${name[0].id} ${name[0].name}\n`); 
        }); 
}, 1000);

const promise = new Promise((res, rej) => {
    try {
        setTimeout(() => {
            res(
                app.route("/promise")
                    .get((rq, rs) => {
                        console.log(rq.method, rq.url)
                        rs.send(`Promise:\n${name[0].id} ${name[0].name}\n`); 
                    })
                );
        }, 1000);
    } catch (err) {
        rej("Error:", err);
    };
});

promise
    .then(s => {console.log(s)})
    .catch(e => {console.log(e)}) 

async function myFirstAsync() {
    try {
        const async_await = await app.route("/async").get((rq, rs) => {
            console.log(rq.method, rq.url)
            rs.send(`Async:\n${name[0].id} ${name[0].name}\n`); 
        });

        console.log(async_await);
    } catch (err) {
        console.log("Error:", err)
    };
}

myFirstAsync();

async function myNameFile() {
    try {
        const data = await fs.readFile("name.txt", "utf8");
        app.route("/file")
            .get((rq, rs) => {
                console.log(rq.method, rq.url)
                rs.send(data)
            })
    } catch (err) {
        console.log("Error:", err)
    };
};

myNameFile();

function simulateDelay(ms) {
    const promise = new Promise((res, rej) => {
        try {
            const steps = require('./steps.json')
            setTimeout(() => {
                res(
                    app.route("/chain")
                        .get((rq, rs) => {
                            console.log(rq.method, rq.url)
                            rs.json(steps)
                        })
                )
            }, ms)
        } catch (err) {
            rej("Error:", err)
        }
    });

    setTimeout(() => {
        promise
        .then(v => {return "Login complete"})
        .then(v => {console.log(v); return "Fetched user data"})
        .then(v => {console.log(v); return "Rendered UI"})
        .then(v => {console.log(v)})
        .catch(e => {console.log(e)})
    }, ms);
}

simulateDelay(1000);

const server = () => (console.log("server is running."));

app.listen(port, server);