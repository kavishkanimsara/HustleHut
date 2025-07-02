const { MongoClient, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://kesara:EtMTcdxksmaxCWeF@cluster0.h5lz93d.mongodb.net/HustleHut?retryWrites=true&w=majority&appName=Cluster0"; // <-- Replace with your actual connection string

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("HustleHut"); // <-- Replace with your database name

    const attendanceCollection = db.collection("Attendance");

    // Replace with a real user ObjectId from your users collection
    const userId = new ObjectId("6863f7eaa8371eaa8d3e18af");

    const sampleAttendance = {
      userId: userId,
      attendance: [
        {
          date: "2024-05-01",
          status: "Present",
          checkIn: "09:00",
          checkOut: "17:00",
        },
        {
          date: "2024-05-02",
          status: "Absent",
          checkIn: null,
          checkOut: null,
        },
      ],
      summary: {
        totalDays: 2,
        present: 1,
        late: 0,
        absent: 1,
      },
      recordedAt: new Date("2024-05-02T17:00:00.000Z"),
    };

    const result = await attendanceCollection.insertOne(sampleAttendance);
    console.log("Inserted attendance with _id:", result.insertedId);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
