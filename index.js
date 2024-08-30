const express = require("express");
const fs = require('fs');
const users = require("./MOCK_DATA.json"); 
const cors = require('cors'); // Add cors middleware

const app = express();
const PORT = 8000;

// Enable CORS for all origins (adjust for production)
app.use(cors({
  origin: '*' // Replace with specific allowed origins for production
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.carName}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// REST API
app.get("/firstapi/users", (req, res) => {
  return res.json(users);
});

app.route('/firstapi/users/:id')
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    // Edit user with id
    // PATCH  Purpose: Applies partial updates to an existing resource.
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({ status: "Not Found" });
    }
    const body = req.body;
    Object.keys(body).forEach(key => {
      user[key] = body[key];
    });
    fs.writeFile(".MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "Error" }); // Handle errors
      }
      res.json({ status: "success" });
    });
  })
  .delete((req, res) => {
    // Delete user with id
        //DELETE Purpose: Removes a resource from the server.

    const id = Number(req.params.id);      
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      return res.status(404).json({ status: "Not Found" });
    }
    users.splice(index, 1);
    fs.writeFile(".MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "Error" }); // Handle errors
      }
      res.json({ status: "success" });
    });
  });

  //POST Purpose: Sends data to a server to create or update a resource.
app.post('/firstapi/users', (req, res) => {
  const body = req.body;
  console.log("body", body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile(".MOCK_DATA.json", JSON.stringify(users), (err, data)  => { 

    if (err) {
      console.error(err);
      return res.status(500).json({ status: "Error" }); // Handle errors
    }
    res.json({ status: "success", id: users.length });
  });
});

app.put('/firstapi/users/:id', (req, res) => {
  // Update user with id
  // PUT Purpose: Replaces an existing resource entirely.

  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ status: "Not Found" });
  }
  const body = req.body;
  Object.keys(body).forEach(key => {
    user[key] = body[key];
  });
  fs.writeFile(".MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: "Error" }); // Handle errors
    }
    res.json({ status: "success" });
  });
})

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));


