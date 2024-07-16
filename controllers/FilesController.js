const { redisClient } = require('../utils/redis');
const { dbClient } = require("../utils/db");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


class FilesController {
    static async postUpload(req, res) {
        // retrieves token from request headers
        const token = req.headers['x-token'];
        // checks for token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // grabs redis key using token
        const key = `auth_${token}`;
        // gets userId linked to the redis token
        const userId = await redisClient.get(key);

        // checks if userId exists
        if (!userId) {
            return res.status(401).json({ errror: 'Unauthorized' });
        }

        // extracts teh file details from body
        const { name, type, parentId = '0', isPublic = false, data } = req.body;

        // checks if the file name is empty
        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }

        // checks if the file type is empty
        if (!['folder', 'file', 'image'].includes(type)) {
            return res.status(400).json({ error: ' Missing type' });
        }

        // checks if the folder contains both a file nad data
        if (type !== 'folder' && !data) {
            return res.status(400).json({ error: 'Missing data' });
        }

        // checks if the folder contains a parent id
        if (parentId !== '0') {
          // finds parent file by its id
          const parentFile = await dbClient.findFileById(parentId);
          // checks if the parent file exists
          if (!parentFile) {
            return res.status(400).json({ error: 'Parent not found' });
          }
          // checks if the parent file is not a folder
          if (parentFile.type !== 'folder') {
              return res.status(400).json({ error: 'Parent is not a folder' });
          }
        }

        // Creates a file doc with the variable listed below
        const fileDoc = {
            userId,
            name,
            type,
            parentId,
            isPublic,
            data,
        };

        // creates a new file  doc
        if (type === 'folder') {
            const newFile = await dbClient.createFile(fileDoc);
            return res.status(201).json(newFile);
        }

        // folder path for storing files
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // generates unique path for the file
        const localPath = path.join(folderPath, uuidv4());
        //decodes the based64 data and writes it to the disk
        fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

        // adds teh local path to the file
        fileDoc.localPath = localPath; 
        //creates file doc to database
        const newFile = await dbClient.createFile(fileDoc);

        return res.status(201).json(newFile);
    }
}

module.exports = FilesController;
