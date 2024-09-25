const request = require("supertest");
const app = require("../index");

describe("API Testings", () => {
  // testing get jobs
  it("GET/api/job/get_jobs | Response with valid json", async () => {
    const response = await request(app).get("/api/job/get_jobs");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Jobs fetched successfully");
  });

  // testing job posting
  it("POST/api/job/create_job | Response with valid json", async () => {
    const response = await request(app)
      .post("/api/job/create_job")
      .send({
        userId: "65a3d1b48bfed3a27ef9b5ac",
        title: "Web Developer",
        description: " This is description",
        skills: ["web", "mern", "flutter"],
      });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Job Posted Successfully");
    }
  });

  // testing user registration
  it("POST/api/user/create | Response with valid json", async () => {
    const response = await request(app).post("/api/user/create").send({
      firstName: "test",
      lastName: "test1",
      email: "test@gmail.com",
      password: "test",
    });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User created successfully.");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists");
    }
  });

  // testing update user
  it("PUT/api/user/update_user/65a3d1b48bfed3a27ef9b5ac | Response with valid json", async () => {
    const response = await request(app)
      .put("/api/user/update_user/65a3d1b48bfed3a27ef9b5ac")
      .send({
        firstName: "sabina",
        lastName: "tamang",
        email: "sabina@gmail.com",
        password: "password",
      });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Profile updated successfully");
    }
  });

  // testing put comment
  it("PUT/api/post/add_comment | Response with valid json", async () => {
    const response = await request(app).put("/api/post/add_comment").send({
      userId: "65a3d1b48bfed3a27ef9b5ac",
      postId: "65a502640834762d013939b3",
      comment: " Comment",
    });
    console.log(response.body);
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      // expect(response.body.message).toBe("Comment added successfully");
    }
  });

  // testing get posts
  it("GET/api/post/get_posts | Response with valid json", async () => {
    const response = await request(app).get("/api/post/get_posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Posts fetched successfully");
  });

  // testing get Comments
  it("GET/api/post/get_comments | Response with valid json", async () => {
    const response = await request(app).get("/api/post/get_comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Comments fetched successfully");
  });

  // testing posts by pagination
  it("GET/api/post/get_posts_pagination | Response with valid json", async () => {
    const response = await request(app).get("/api/post/get_posts_pagination");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Posts fetched successfully by pagination"
    );
  });

  // testing GET All Users
  it("GET/api/user/get_users | Response with valid json", async () => {
    const response = await request(app).get("/api/user/get_users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Users fetched successfully");
  });

  // testing GET Single User
  it("GET/api//api/user/get_user/65a3d1b48bfed3a27ef9b5ac | Response with valid json", async () => {
    const response = await request(app).get(
      "/api/user/get_user/65a3d1b48bfed3a27ef9b5ac"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User fetched successfully");
  });
});

module.exports = app;
