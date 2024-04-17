import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import archiver from "archiver";
import AWS from "aws-sdk";

// AWS S3 configuration

// Create an S3 client instance
const s3Client = new S3Client({
  // The region of the bucket we're referencing
  region: "eu-west-3",

  // Set the AWS credentials we're using
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Create an S3 configuration object
const s3Config = new AWS.Config({
  // Set the AWS credentials we're using
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },

  // The region of the bucket we're referencing
  region: "eu-west-3",
});

// Create an S3 service object
const s3 = new AWS.S3(s3Config);

/**
 * Upload a file to S3
 * @param {string} destination - The S3 key of the file to upload
 * @param {object} file - The file object containing the file metadata
 * @param {string} fileContent - The base64 encoded file content
 * @returns {Promise} - A promise that resolves when the file is uploaded
 */
const uploadFile = async (destination, file, fileContent) => {
  // The parameters to pass to the PutObjectCommand
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME, // The name of the bucket to upload to
    Key: destination, // File name you want to save as in S3
    Body: fileContent, // The base64 encoded file content
    ContentType: file.mimetype, // The MIME type of the file
    ContentEncoding: "base64", // Set content encoding to base64 to handle binary data
    ACL: "public-read", // Make the file publicly readable
  };
  return s3Client.send(new PutObjectCommand(uploadParams));
};

/**
 * Delete a file from S3
 * @param {string} key - The S3 key of the file to delete
 * @returns {Promise} - A promise that resolves when the file is deleted
 */
const deleteFile = async (key) => {
  // The parameters to pass to the DeleteObjectCommand
  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME, // The name of the bucket to delete from
    Key: key, // The key of the file to delete
  };

  // Send the delete request and resolve the promise when completed
  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

/**
 * Create an empty folder in S3
 * @param {string} key - The S3 key of the folder to create
 * @returns {Promise} - A promise that resolves when the folder is created
 */
const createFolder = async (key) => {
  // Create an empty object with the folder name as key
  const folderParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key + "/", // Add a trailing slash to make it a folder
  };
  return s3Client.send(new PutObjectCommand(folderParams));
};

/**
 * Delete a folder in S3, including all files inside it.
 * @param {string} key - The S3 key of the folder to delete
 * @returns {Promise} - A promise that resolves when the folder is deleted
 */
const deleteFolder = async (key) => {
  // Initialize a flag to track whether any files were deleted
  let filesDeleted = false;

  // List all objects in the target folder and subfolders
  const folderParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key, // Start listing objects from the folder
  };
  const list = await s3Client.send(new ListObjectsCommand(folderParams));

  if (list.Contents && list.Contents.length !== 0) {
    // Delete all files inside the folder and subfolders
    await Promise.all(
      list.Contents.map(async (item) => {
        if (item.Size > 0) {
          await deleteFile(item.Key);
        }
      })
    );

    // Set the flag to true if any files were deleted
    filesDeleted = list.Contents.some((item) => item.Size > 0);

    // If any files were deleted, delete the empty folders
    if (filesDeleted) {
      await Promise.all(
        list.Contents.map(async (item) => {
          // Delete the folder only if it is empty (size == 0)
          if (item.Size === 0) {
            const deleteFolderParams = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: item.Key,
            };
            await s3Client.send(new DeleteObjectCommand(deleteFolderParams));
          }
        })
      );
    }
  }
};

/**
 * Check if an object exists in S3
 * @param {string} key - The S3 key of the object to check
 * @returns {Promise<boolean>} - A promise that resolves to true if the object
 * exists, false otherwise
 */
const checkExisting = async (key) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    await s3Client.send(new HeadObjectCommand(params));
    return true;
  } catch (err) {
    // If the object does not exist, S3 will throw an error
    // with a 404 status code
    return false;
  }
};

/**
 * Get a list of all keys in an S3 folder and all subfolders
 * @param {string} key - The S3 key of the folder to get a key list for
 * @returns {Promise<string[]>} - A promise that resolves with an array of
 * S3 keys
 */
const getKeyList = async (key) => {
  const keyList = [];

  // List objects in the target folder
  const listObjectsV2Params = new ListObjectsCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key, // Start listing objects from the folder
  });
  const listedObjects = await s3Client.send(listObjectsV2Params);

  // Add all keys in the folder to the list
  keyList.push(...listedObjects.Contents.map((obj) => obj.Key));

  // If there are subfolders (CommonPrefixes), call getKeyList recursively
  // and add the keys from those subfolders to the list
  if (listedObjects.CommonPrefixes) {
    for (const prefix of listedObjects.CommonPrefixes) {
      const subfolderKey = prefix.Prefix;
      const subfolderKeys = await getKeyList(subfolderKey);
      keyList.push(...subfolderKeys);
    }
  }

  return keyList;
};

/**
 * Make an archive of the contents of a folder in S3
 * @param {string} key - The S3 key of the folder to archive
 * @param {import("express").Response} res - The Express response object
 * @param {string} folder - The name of the folder to archive
 * @returns {Promise<import("archiver").Archiver>} - A promise that resolves
 * with the archiver instance when the archive is finished
 */
const makeArchive = async (key, res, folder) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key,
    StartAfter: key,
  };

  const { Contents } = await s3.listObjectsV2(params).promise();

  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { gzip: true, zlib: { level: 9 } });

    // Handle errors during archiving
    archive.on("error", (err) => {
      reject(err);
    });

    // Resolve the promise when the archive is finished
    archive.on("finish", () => {
      resolve(archive);
    });

    // Pipe the archive to the response to stream it
    archive.pipe(res);

    // Add each file in the folder to the archive
    for (const content of Contents) {
      // Remove the folder prefix from the key
      const regex = new RegExp(`.*\\/${folder}\\/`);
      const contentKey = content.Key.replace(regex, `${folder}/`);

      // Get a read stream of the file from S3
      const file = s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: content.Key,
        })
        .createReadStream();

      // Add the file to the archive with its original name
      archive.append(file, { name: contentKey });
    }

    // Finish the archive
    archive.finalize();
  });
};

/**
 * Download a file from S3
 * @param {string} path - The S3 path of the file to download
 * @param {import("express").Response} res - The Express response object
 * @returns {Promise<void>} - A promise that resolves when the file is downloaded
 */
const downloadFile = async (path, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: path,
    };

    const { Body } = await s3Client.send(new GetObjectCommand(params));

    // Stream the file to the response
    Body.pipe(res);
  } catch (error) {
    // Send a 500 error if something goes wrong
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getOneSignedUrl = async (key, expiresIn) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresIn });
};

export {
  checkExisting,
  createFolder,
  deleteFile,
  deleteFolder,
  downloadFile,
  getKeyList,
  getOneSignedUrl,
  makeArchive,
  s3Client,
  uploadFile,
};
