import express from "express";
import bodyParser from "body-parser";
import startRedisClient from "../Redis/redisClient";

import { PrismaClient } from '@prisma/client'
import cors from "cors";

const prisma = new PrismaClient();
const expressApp = express();
expressApp.use(cors());
const jsonParser = bodyParser.json();
const redisClient = startRedisClient();

expressApp.post('/cache', jsonParser, (req, res) => {
    const { key, value } = req.body;
    console.log('Got body:', req.body);
    redisClient.set(key, value);
    res.sendStatus(200);
});

expressApp.get('/', (req, res) => {
    res.send('Hello World!');
});

expressApp.get('/getMilkRecords', async (req:any, res) => {
    res.send(await prisma.milkRecord.findMany());
});

expressApp.get('/getCows', async (req:any, res) => {
    res.send(await prisma.cow.findMany());
});

expressApp.get('/getFarms', async (req:any, res) => {
    res.send(await prisma.farm.findMany());
});

expressApp.get('/getMilkRecord', async (req:any, res) => {
    const { cowID } = req.query;
    // console.log('Got query:', req.query);
    if (cowID === undefined) {
        return res.sendStatus(400);
    }
    const result = await prisma.milkRecord.findMany({
        where: {
            cowID: parseInt(cowID.toString()),
        },
    });
    res.send(result);
});

expressApp.post('/prediction',jsonParser , async (req:any, res) => {
    console.log('Got query:', req.body);
    const { cowID, predictions } = req.body;
    if (cowID === undefined || predictions === undefined || predictions.length === 0) {
        return res.sendStatus(400);
    }
    const result = await prisma.cow.update({
        where: {
            ID: parseInt(cowID),
        },
        data: {
            prediction: JSON.stringify(predictions),
        },
    });
    res.send(result);
});

expressApp.post('/forceRecord', jsonParser, async (req:any, res) => {
    const { cowID, weight, timestamp } = req.body;
    console.log('Got body:', req.body);
    const result = await prisma.milkRecord.create({
        data: {
            weight: weight,
            cowID: cowID,
            timestamp : timestamp,
        },
    });
    console.log(result);
    res.send(result);
});

expressApp.post('/farm', jsonParser, async (req:any, res) => {
    const { name, owner } = req.body;
    console.log('Got body:', req.body);
    const result = await prisma.farm.create({
        data: {
            name: name,
            owner: owner,
        },
    });
    console.log(result);
    res.send(result);
});

expressApp.post('/breedingRecord', jsonParser, async (req:any, res) => {
    const { fatherName, motherID, calfGender, calfWeight, timestamp } = req.body;
    console.log('Got body:', req.body);
    const result = await prisma.breedingRecord.create({
        data: {
            fatherName : fatherName,
            motherID : motherID,
            calfGender : calfGender,
            calfWeight : calfWeight,
            timestamp: timestamp
        },
    });
    console.log(result);
    res.send(result);
});

expressApp.post('/cow', jsonParser, async (req:any, res) => {
    const { name, farmName, birthDate, genetic, weightAtBirth, fatherName, motherName, fatherGenetic, motherGenetic } = req.body;
    // console.log('Got body:', req.body);
    // console.log(req.params);
    const farmID = (await prisma.farm.findFirst({
        where : {
            name : farmName
        }
    }))?.ID ?? 0
    const result = await prisma.cow.create({
        data: {
            name: name,
            farmID: farmID,
            genetic: genetic,
            birthDate: new Date(parseInt(birthDate)),
            weightAtBirth: parseFloat(weightAtBirth),
            fatherName: fatherName,
            motherName: motherName,
            fatherGenetic: fatherGenetic,
            motherGenetic: motherGenetic,
        },
    });
    console.log(result);
    res.send(result);
});

export default expressApp;