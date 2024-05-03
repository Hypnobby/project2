const jwt = require("jwt-simple");

describe("Routes: Items", () => {
    const Users = app.db.models.Users;
    const Items = app.db.models.Items;
    const jwtSecret = app.libs.config.jwtSecret;
    let token;
    let fakeItem;

    beforeEach(done => {
        Users
            .destroy({where: {}})
            .then(() => Users.create({
                name: "test",
                email: "test@test.com",
                password: "password123"
            }))
            .then(user => {
                Items
                    .destroy({where: {}})
                    .then(() => Items.bulkCreate([{
                        id: 1,
                        itemID: 1001,
                        itemName: "Handmade Necklace",
                        price: 29.99,
                        material: "Silver, Gemstones",
                        creator: "Alice Craft",
                        description: "Beautifully crafted necklace",
                        UserId: user.id
                    }, {
                        id: 2,
                        itemID: 1002,
                        itemName: "Custom Bracelet",
                        price: 19.99,
                        material: "Leather, Beads",
                        creator: "Bob Smith",
                        description: "Custom made bracelet",
                        UserId: user.id
                    }]))
                .then(items => {
                    fakeItem = items[0];
                    token = jwt.encode({id: user.id}, jwtSecret);
                    done();
                });
        });
    });
    describe("GET /items", () => {
        describe("status 200", () => {
            it("should return all items", done => {
                request.get("/items")
                    .set("Authorization", "JWT " + token)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.length(2);
                        expect(res.body[0].itemName).to.eql("Handmade Necklace");
                        expect(res.body[1].itemName).to.eql("Custom Bracelet");
                        done(err);
                    });
            });
        });
    });
    describe("POST /items", () => {
        describe("status 200", () => {
            it("should create a new item", done => {
                request.post("/items")
                    .set("Authorization", "JWT " + token)
                    .send({
                        itemID: 1024,
                        itemName: "Wooden Decor",
                        price: 34.99,
                        material: "Oak Wood",
                        creator: "Cindy Wood",
                        description: "Handmade wooden decor piece"
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.itemName).to.eql("Wooden Decor");
                        done(err);
                    })
            });
        });
    });
    describe("GET /items/:id", () => {
        describe("status 200", () => {
            it("should return an item", done => {
                request.get("/items/" + fakeItem.id)
                    .set("Authorization", "JWT " + token)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.itemName).to.eql("Handmade Necklace");
                        done(err);
                    });
            });
        });
        describe("status 404", () => {
            it("throws error that item does not exist", done => {
                request.get("/items/0")
                    .set("Authorization", "JWT " + token)
                    .expect(404)
                    .end((err, res) => done(err));
            });
        });
    });
    describe("PUT /items/:id", () => {
        describe("status 204", () => {
            it("should update an item", done => {
                request.put("/items/" + fakeItem.id)
                    .set("Authorization", "JWT " + token)
                    .send({
                        itemID: 1001,
                        itemName: "Handmade Necklace",
                        price: 29.99,
                        material: "Silver, Gemstones",
                        creator: "Alice Craft",
                        description: "Exquisitely crafted necklace"
                    })
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
    describe("DELETE /items/:id", () => {
        describe("status 204", () => {
            it("should delete an item", done => {
                request.delete("/items/" + fakeItem.id)
                    .set("Authorization", "JWT " + token)
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
});
