import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

import Module from "./src/models/Module.js";
import Question from "./src/models/Question.js";
import Option from "./src/models/Option.js";
import UserState from "./src/models/UserState.js";
import ConversationHistory from "./src/models/ConversationHistory.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING);
    console.log("DB connected");

    // 🔥 clear everything
    await Module.deleteMany({});
    await Question.deleteMany({});
    await Option.deleteMany({});
    await UserState.deleteMany({});
    await ConversationHistory.deleteMany({});

    console.log("Old data cleared");

    // ---------- IDs ----------
    const module1Id = new mongoose.Types.ObjectId();
    const module2Id = new mongoose.Types.ObjectId();

    const q1Id = new mongoose.Types.ObjectId();
    const q2Id = new mongoose.Types.ObjectId();
    const q3Id = new mongoose.Types.ObjectId();
    const q4Id = new mongoose.Types.ObjectId();

    const o1_q1 = new mongoose.Types.ObjectId();
    const o2_q1 = new mongoose.Types.ObjectId();

    const o1_q2 = new mongoose.Types.ObjectId();
    const o2_q2 = new mongoose.Types.ObjectId();

    const o1_q3 = new mongoose.Types.ObjectId();
    const o2_q3 = new mongoose.Types.ObjectId();

    const o1_q4 = new mongoose.Types.ObjectId();
    const o2_q4 = new mongoose.Types.ObjectId();

    // ---------- MODULES ----------
    await Module.insertMany([
      {
        _id: module1Id,
        name: "Lesson 1",
        startQuestionId: q1Id
      },
      {
        _id: module2Id,
        name: "Lesson 2",
        startQuestionId: q4Id
      }
    ]);

    // ---------- QUESTIONS ----------
    await Question.insertMany([
      {
        _id: q1Id,
        text: "How do you feel today?",
        moduleId: module1Id,
        options: [o1_q1, o2_q1]
      },
      {
        _id: q2Id,
        text: "Are you stressed?",
        moduleId: module1Id,
        options: [o1_q2, o2_q2]
      },
      {
        _id: q3Id,
        text: "Try a quick exercise?",
        moduleId: module1Id,
        isCheckpoint: true,
        options: [o1_q3, o2_q3]
      },
      {
        _id: q4Id,
        text: "How many hours do you sleep?",
        moduleId: module2Id,
        options: [o1_q4, o2_q4]
      }
    ]);

    // ---------- OPTIONS ----------
    await Option.insertMany([
      // Q1
      {
        _id: o1_q1,
        text: "Good",
        questionId: q1Id,
        nextQuestionId: q2Id
      },
      {
        _id: o2_q1,
        text: "Bad",
        questionId: q1Id,
        nextQuestionId: q2Id
      },

      // Q2
      {
        _id: o1_q2,
        text: "Yes",
        questionId: q2Id,
        nextQuestionId: q3Id
      },
      {
        _id: o2_q2,
        text: "No",
        questionId: q2Id,
        nextQuestionId: q3Id
      },

      // Q3 → MODULE SWITCH
      {
        _id: o1_q3,
        text: "Start exercise",
        questionId: q3Id,
        nextModuleId: module2Id
      },
      {
        _id: o2_q3,
        text: "Skip",
        questionId: q3Id,
        nextModuleId: module2Id
      },

      // Q4 (end)
      {
        _id: o1_q4,
        text: "< 6 hours",
        questionId: q4Id
      },
      {
        _id: o2_q4,
        text: "> 6 hours",
        questionId: q4Id
      }
    ]);

    console.log("Seeding complete");
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed ", err);
    process.exit(1);
  }
};

seed();