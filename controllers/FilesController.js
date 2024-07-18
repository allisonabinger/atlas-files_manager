const { redisClient } = require('../utils/redis');
const { dbClient } = require("../utils/db");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');


class FilesController {

    // posts a new file based on request body, called on by POST /files
    static async postUpload(req, res) {
        // retrieves token from request headers
        const token = req.headers['x-token'];
        // checks for token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        
        // gets userId linked to the redis token
        const userId = await redisClient.get(`auth_${token}`);
        // console.log(`User ID from token: ${userId}`);

        // checks if userId exists
        if (!userId) {
            return res.status(401).json({ errror: 'Unauthorized' });
        }

        // extracts teh file details from body
        const { name, type, data, parentId = 0, isPublic = false } = req.body;
        console.log(`File details - Name: ${name}, Type: ${type}, Data: ${data ? 'Present' : 'Not Present'}`);

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
        if (parentId !== 0) {
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
        };

        // creates a new file  doc
        if (type === 'folder') {
            const newFile = await dbClient.createFile(fileDoc);
            return res.status(201).json({
                id: newFile._id.toString(),
                userId: newFile.userId,
                name: newFile.name,
                type: newFile.type,
                isPublic: newFile.isPublic,
                parentId: newFile.parentId
            });
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

        return res.status(201).json({
            id: newFile._id.toString(),
            userId: newFile.userId,
            name: newFile.name,
            type: newFile.type,
            isPublic: newFile.isPublic,
            parentId: newFile.parent_id,
            localPath: newFile.localPath
        });
    }

    // Retrieves the file document based on the file id, called on by GET /files/:id
    static async getShow(req, res) {
        // retrieves token from request headers
        const token = req.headers['x-token'];
        // checks for token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // gets userId linked to the redis token
        const userId = await redisClient.get(`auth_${token}`);
       // console.log(`User ID from token: ${userId}`);

        // checks if userId exists
        if (!userId) {
            return res.status(401).json({ errror: 'Unauthorized' });
        }

        const fileId = req.params.id;

        // obtains the file doc through the database using fileId and user Id
        const file = await dbClient.findFileByIdAndUser(fileId, userId);
        // checks if file exists
        if (!file) {
            return res.status(404).json({ error: 'Not found' });
        }

        // returns file doc
        return res.status(200).json(file);
    }

    // Retrieves all files for documents for a specific parentId with pagination, 
    // called on by GET /files 
    static async getIndex(req, res) {
        // retrieves token from request headers
        const token = req.headers['x-token'];
        // checks for token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = await redisClient.get(`auth_${token}`);
        //console.log(`User ID from token: ${userId}`);

        // checks if userId exists
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const parentId = req.query.parentId || '0';
        const page = parseInt(req.query.page, 10) || 0;
        const pageSize = 20;

        const files = await dbClient.findFilesByParentAndUser(userId, parentId, page, pageSize);
        //console.log('files:', JSON.stringify(files))
        
        return res.status(200).json(files);
    }

    // updates the isPublic status for a specific file to true
    // called on by PUT /publish
    static async putPublish(req, res) {
        // get token
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // get userId based on token
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // get file id based on request
        const fileId = req.params.id;
        if (!fileId) {
            return res.status(401).json({ error: 'Missing or invalid file ID' });
        }

        try {
            const updatedFile = await dbClient.updateFilePublicStatus(userId, fileId, true);  

            if (!updatedFile) {
                return res.status(404).json({ error: 'Not found' });
            }
            return res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error publishing the file: ', error);
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
     // updates the isPublic status for a specific file to false
    // called on by PUT /unpublish
    static async putUnpublish(req, res) {
        // get token
        const token = req.headers['x-token'];
        //console.log(`token: ${token}`);
        if (!token) {
            console.log('Could not get token');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // get userId based on token
        const userId = await redisClient.get(`auth_${token}`);
        //console.log(`userId: ${userId}`);
        if (!userId) {
            console.log('could not get userId');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // get file id based on request in parameter
        const fileId = req.params.id;
        //console.log(`fileId: ${fileId}`)
        if (!fileId) {
            return res.status(401).json({ error: 'Missing or invalid file ID' });
            console.log('could not get fileId')
        }

        try {
            const updatedFile = await dbClient.updateFilePublicStatus(userId, fileId, false);  

            if (!updatedFile) {
                return res.status(404).json({ error: 'Not found' });
            }
            return res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error publishing the file: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // getFile accesses the data of a file and display's its contents
    static async getFile(req, res) {
        const token = req.headers['x-token'];
        const fileId = req.params.id;

        if (!fileId) {
            return res.status(400).json({ error: 'Missing or invalid fileId' });
        }
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(400).json({ error: 'Missing or invalid userId' });
        }
        try {
            const file = await dbClient.findFileById(fileId);
            if (!file) {
                return res.status(400).json({ error: 'File not found' });
            }

            if (!file.isPublic && (!userId || file.userId !== userId)) {
                return res.status(404).json({error: 'Not found' });
            }
            if (file.type == 'folder') {
                return res.status(400).json({ error: "A folder doesn't have content" });
            }
            const filePath = file.localPath;
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Not found' });
            }
            // determine MIME type, octet-stream is used to rep. binary data, default mime type
            const mimeType = mime.lookup(file.name) || 'application/octet-stream';
            res.setHeader('Content-Type', mimeType);
            fs.createReadStream(filePath).pipe(res);
        } catch (error) {
            console.error('Error retrieving file: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = FilesController;
