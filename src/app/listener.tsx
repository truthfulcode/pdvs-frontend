'use server'
import { publicClient } from "@/utils/utils";
import express from "express";
import next from "next";

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});

app.prepare().then(()=>{
    const server = express();

    publicClient.watchEvent({
        onLogs: logs => console.log(logs.length)
    });
})