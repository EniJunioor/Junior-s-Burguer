import os from "os";
import prisma from "@prisma/client";
import nodemailer from "nodemailer";

export const healthCheck = async (req, res) => {
    try {
        await prisma.$queryRawUnsafe(`SELECT 1`);

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
