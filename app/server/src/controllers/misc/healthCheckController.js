import os from "os";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const healthCheck = async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            status: "OK",
            database: "Connected",
            cpuUsage: os.loadavg(),
            memoryUsage: process.memoryUsage().rss,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            database: "Disconnected",
            error: error.message,
        });
    }
};

// Endpoint básico para monitoramento externo
export const statusCheck = (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
};
