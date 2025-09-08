import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { Product } from "../models/ProductCatalog";
import { connectDB } from "../config/database";

describe("Products API", () => {
  // Connect to DB before running any tests
  beforeAll(async () => {
    await connectDB();
  });

  // Clean DB before each test
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  // Close DB connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ------------------ CREATE PRODUCT ------------------
  describe("POST /api/productcatalog", () => {
    it("should create a new product", async () => {
      const productData = {
        name: "iPhone 15 Pro",
        description: "Latest Apple iPhone",
        price: 1500,
        category: "Electronics",
        stock: 50,
      };

      const response = await request(app)
        .post("/api/productcatalog") // ✅ Updated path
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.description).toBe(productData.description);
      expect(response.body.data.price).toBe(productData.price);
      expect(response.body.data.category).toBe(productData.category);
      expect(response.body.data.stock).toBe(productData.stock);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/api/productcatalog")
        .send({}) // missing required fields
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });
  });

  // ------------------ GET PRODUCTS ------------------
  describe("GET /api/productcatalog", () => {
    beforeEach(async () => {
      await Product.create([
        {
          name: "Product 1",
          description: "Description 1",
          price: 100,
          category: "Electronics",
          stock: 10,
        },
        {
          name: "Product 2",
          description: "Description 2",
          price: 200,
          category: "Books",
          stock: 5,
        },
        {
          name: "Product 3",
          description: "Description 3",
          price: 300,
          category: "Fashion",
          stock: 8,
        },
      ]);
    });

    it("should get all products", async () => {
      const response = await request(app)
        .get("/api/productcatalog") // ✅ Updated path
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(3);
    });
  });

  // ------------------ UPDATE PRODUCT ------------------
  describe("PUT /api/productcatalog/:id", () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create({
        name: "Old Product",
        description: "Old Description",
        price: 500,
        category: "Electronics",
        stock: 20,
      });
      productId = product._id.toString();
    });

    it("should update an existing product", async () => {
      const updateData = { name: "Updated Product", price: 1200 };

      const response = await request(app)
        .put(`/api/productcatalog/${productId}`) // ✅ Updated path
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);

      const updatedProduct = await Product.findById(productId);
      expect(updatedProduct?.name).toBe(updateData.name);
      expect(updatedProduct?.price).toBe(updateData.price);
    });

    it("should return 404 if product does not exist", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .put(`/api/productcatalog/${fakeId}`)
        .send({ name: "Doesn't exist" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 400 for invalid product ID", async () => {
      const response = await request(app)
        .put(`/api/productcatalog/invalid-id`)
        .send({ name: "New Name" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid parameters");
    });

    it("should return validation error for invalid data", async () => {
      const response = await request(app)
        .put(`/api/productcatalog/${productId}`)
        .send({ name: "" }) // ❌ invalid due to .min(1)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });
  });

  // ------------------ DELETE PRODUCT ------------------
  describe("DELETE /api/productcatalog/:id", () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create({
        name: "Product to delete",
        description: "This will be deleted",
        price: 999,
        category: "Gadgets",
        stock: 10,
      });

      productId = product._id.toString();
    });

    it("should delete an existing product", async () => {
      const response = await request(app)
        .delete(`/api/productcatalog/${productId}`) // ✅ Updated path
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Product deleted successfully");

      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .delete(`/api/productcatalog/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 400 for invalid product ID", async () => {
      const response = await request(app)
        .delete(`/api/productcatalog/invalid-id`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid parameters");
    });
  });
});
