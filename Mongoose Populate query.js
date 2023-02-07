const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://localhost/samplePopulate")
  .then(() => {
    console.log("Database Successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

const studentSchema = mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const student = mongoose.model("student", studentSchema);

const classSchema = mongoose.Schema({
  class: {
    type: String,
  },
  students: [{ type: "ObjectId", ref: "student" }],
});

const classes = mongoose.model("classes", classSchema);

app.get("/", (req, res) => {
  return res.status(200).send("Hello");
});

app.post("/addStudent", async (req, res) => {
  try {
    const { name, age } = req.body;
    const stu = await student.create({
      name: name,
      age: age,
    });

    if (stu) {
      return res.status(200).json({
        msg: "Student created successfully!",
      });
    } else {
      return res.status(202).json({
        msg: "There is Fault",
      });
    }
  } catch (err) {
    return res.send(err);
  }
});

app.post("/createClass", async (req, res) => {
  try {
    const { classs } = req.body;

    const cla = await classes.create({
      class: classs,
    });

    if (cla) {
      return res.status(200).json({
        msg: "Class Added Successfully",
      });
    }
  } catch (err) {
    return res.send(err);
  }
});

app.patch("/addStuClass/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const { stuId } = req.body;
    const adds = await classes.updateOne(
      {
        _id: classId,
      },
      { $push: { students: stuId } }
    );

    if (adds) {
      return res.status(200).json({
        msg: "Student Added Successfully",
      });
    } else {
      return res.status(400).json({
        msg: "Student Not Added",
      });
    }
  } catch (err) {
    return res.send(err);
  }
});

app.get('/getData', async (req, res) => {
    try { 
        const result = await classes.find({}).populate('students').exec();

        return res.send(result)
    }
    catch(err) {
        return res.json({
            msg: "Data cannot Sent"
        })
    }
})

app.listen(6000, () => {
  console.log("Server is Started");
});

//populate query used to store the reference of one document in other document.
