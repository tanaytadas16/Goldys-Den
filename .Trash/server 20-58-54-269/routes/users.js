const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const {ObjectId} = require("mongodb");
const imageData = require("../graphics");

stateList = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
];

function checkIsString(s) {
    if (typeof s !== "string") throw "Given input is invalid";
    if (s.length < 1) throw "Given input is empty";
    if (s.trim().length === 0) throw "Given input is all white spaces";
}

function checkIsName(s) {
    if (/[^a-zA-Z]/.test(s)) throw "Given input is not only letters";
}

function checkIsPassword(s) {
    if (s.length < 8) throw "Given password size is less than 8";
}

function checkIsEmail(s) {
    if (!/^\S+@[a-zA-Z]+\.[a-zA-Z]+$/.test(s))
        throw "Given email id is invalid";
}

function checkIsUsername(s) {
    if (s.length < 4) throw "Given username size is less than 4";
}

router.post("/signup", async (req, res) => {
    let {
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        address,
        city,
        state,
        zip,
    } = req.body;
    // console.log(userInfo);

    if (
        !(
            firstName &&
            lastName &&
            email &&
            username &&
            password &&
            phoneNumber &&
            address &&
            city &&
            state &&
            zip
        )
    ) {
        return res.status(400).send("You must provide all values.");
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.toLowerCase().trim();
    username = username.toLowerCase().trim();
    password = password.trim();
    phoneNumber = phoneNumber.trim();
    address = address.trim();
    city = city.trim();
    state = state.trim();
    zip = zip.trim();

    try {
        checkIsString(firstName);
        checkIsString(lastName);
        checkIsString(email);
        checkIsString(username);
        checkIsString(password);
        checkIsString(address);
        checkIsString(city);
        checkIsString(state);
        checkIsString(zip);

        checkIsName(firstName);
        checkIsName(lastName);

        checkIsEmail(email);
        checkIsUsername(username);
        checkIsPassword(password);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    try {
        let initials = firstName[0] + lastName[0];
        console.log(initials);
        let image = imageData.createImage(initials);
        const newUser = await userData.createUser(
            firstName,
            lastName,
            email,
            phoneNumber,
            username,
            password,
            address,
            city,
            state,
            zip,
            "/server/imgs/initials.png"
        );
        res.status(200).json(newUser);
    } catch (e) {
        return res.status(500).send(String(e));
    }
});

router.get("/logout", async (req, res) => {
    res.redirect("/users/login");
});

router.post("/login", async (req, res) => {
    let {username, password} = req.body;

    if (!(username && password))
        return res.status(400).send("You must provide all values.");

    username = username.toLowerCase().trim();

    try {
        checkIsString(username);
        checkIsString(password);

        checkIsUsername(username);
        checkIsPassword(password);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    try {
        let auth = await userData.checkUser(username, password);
        if (auth.authenticated) res.status(200).json(auth);
        else res.status(401).send("Invalid username or password");
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
});

// router.delete("/delete/:id", async (req, res) => {
//   if (!req.params.id) {
//     res.status(400).json({ error: "You must supply a user Id" });
//     return;
//   }

//   try {
//     const deleteData = await userData.deleteUser(req.params.id);
//     res.redirect("/users/logout");
//   } catch (error) {
//     res.status(404).json({ message: "Data not found " });
//     return;
//   }
// });

router.get("/profile", async (req, res) => {
    // error check
    try {
        if (!req.body.userId) throw "must provide user Id";
        ObjectId(req.body.userId);
    } catch (e) {
        return res.status(400).send(String(e));
    }
    try {
        res.status(200).json(await userData.getUser(req.body.userId));
    } catch (e) {
        res.status(500).send(String(e));
    }
});

router.put("/profile", async (req, res) => {
    let {
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        address,
        city,
        state,
        zip,
    } = req.body;

    try {
        if (!firstName) throw "Must provide the first name";
        if (!lastName) throw "Must provide the last name";
        if (!email) throw "Must provide the email";
        if (!username) throw "Must provide the username";
        if (!password) throw "Must provide the password";
        if (!phoneNumber) throw "Must provide the phone number";
        if (!address) throw "Must provide the address";
        if (!city) throw "Must provide the city";
        if (!state) throw "Must provide the state";
        if (!zip) throw "Must provide the zip";

        checkIsString(firstName);
        checkIsString(lastName);
        checkIsString(email);
        checkIsString(username);
        checkIsString(password);
        checkIsString(address);
        checkIsString(city);
        checkIsString(state);
        checkIsString(zip);

        checkIsName(firstName);
        checkIsName(lastName);

        checkIsEmail(email);
        checkIsUsername(username);
        checkIsPassword(password);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    let userId = req.body.userId;
    try {
        if (!userId) throw "must provide user Id";
        userId = ObjectId(userId);
    } catch (e) {
        return res.status(400).send(String(e));
    }

    try {
        updatedUser = await userData.updateUser(
            userId,
            firstName,
            lastName,
            email,
            phoneNumber,
            username,
            password,
            address,
            city,
            state,
            zip
        );
        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).send(String(e));
    }
});

module.exports = router;
