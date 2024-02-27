import express from "express";
const token =
  "IjQyZjY5YmE5YzllZjRjOGQwMmYyMjE0OTRiNDY0ODc4ZTg5ZWY1Nzgi.Zd17BA.0_BCmaCoEsdYqUZsk7mIgQWP7Bs%27";
const app = express();

//Set static folder
app.use(express.static("public"));

//Parse URL-encoded bodies (as sent bt HTML forms)
app.use(express.urlencoded({ extended: true }));

//Handle GET request to fetch users
app.get("/users", async (req, res) => {
  const limit = +req.query.limit || 10;

  setTimeout(async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}`,
    );
    const users = await response.json();

    res.send(`
      <h1 class="text-2xl font-bold my-4">Users</h1>
      <ul>
        ${users.map((user) => `<li>${user.name}</li>`).join("")}
      </ul>
    `);
  }, 500);
});

//Handle POST request to convert unit
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = ((fahrenheit - 32) * (5 / 9)).toFixed(2);
    res.send(`
      <p>${fahrenheit} degrees Fahrenheit is equal to ${celsius} degrees Celsius.</p>
    `);
  }, 500);
});

//Handle GET request to get weather
app.get("/get-weather", async (req, res) => {
  setTimeout(async () => {
    const response = await fetch(
      `https://www.weatherbit.io/widget/current?ip=45.144.227.14&token=${token}`,
      {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      },
    );
    const temp = (await response.json()).current.temp;
    res.send(`
      <p class="text-5xl font-bold m-auto">${temp}</p>
    `);
  }, 500);
});

//Handle POST request to fetch api and search users
app.post("/search/api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if (!searchTerm) {
    return res.send("<tr></tr>");
  }
  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();
  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });
  setTimeout(() => {
    const searchResultHtml = searchResults
      .map((contact) => {
        return `<tr>
          <td>
            <div class="my-4 p-2">${contact.name}</div>
          </td>
          <td>
            <div class="my-4 p-2">${contact.email}</div>
          </td>
        </tr>`;
      })
      .join("");
    res.send(searchResultHtml);
  }, 1000);
});

app.post("/contact/email", async (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  const isValid = {
    message: "Email is Valid.",
    class: "text-green-700",
  };
  const isInvalid = {
    message: "Please enter a valid email.",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label class="block text-gray-700 text-sm font-bold mb-2" type="email">Email Address</label>
        <input 
          name="email" 
          hx-post="/contact/email" 
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          type="email"
          id="email"
          value=${submittedEmail}
          required
        />
      <div class="${isInvalid.class}">${isInvalid.message}</div>
      </div>
      `,
    );
  } else {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label class="block text-gray-700 text-sm font-bold mb-2" type="email">Email Address</label>
        <input 
          name="email" 
          hx-post="/contact/email" 
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          type="email"
          id="email"
          value=${submittedEmail}
          required
        />
      <div class="${isValid.class}">${isValid.message}</div>
      </div>
      `,
    );
  }
});
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
