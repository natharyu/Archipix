import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import archiver from "archiver";
import AWS from "aws-sdk";

const s3Client = new S3Client({
  region: "eu-west-3",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});
const s3Config = new AWS.Config({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  region: "eu-west-3",
});
const s3 = new AWS.S3(s3Config);

const uploadFile = async (destination, file, fileContent) => {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: destination, // File name you want to save as in S3
    Body: fileContent,
    ContentType: file.mimetype,
    ContentEncoding: "base64",
    ACL: "public-read",
  };
  return s3Client.send(new PutObjectCommand(uploadParams));
};

const deleteFile = async (key) => {
  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };
  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

const createFolder = async (key) => {
  console.log(key);
  const folderParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key + "/",
  };
  return s3Client.send(new PutObjectCommand(folderParams));
};

const deleteFolder = async (key) => {
  let filesDeleted = false;
  const folderParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key,
  };
  const list = await s3Client.send(new ListObjectsCommand(folderParams));

  if (list.Contents && list.Contents.length !== 0) {
    list.Contents.map(async (item) => {
      if (item.Size > 0) {
        await deleteFile(item.Key);
      }
    });
    filesDeleted = true;
    if (filesDeleted) {
      list.Contents.map(async (item) => {
        if (item.Size == 0) {
          const deleteFolderParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: item.Key,
          };
          await s3Client.send(new DeleteObjectCommand(deleteFolderParams));
        }
      });
    }
  }
};

const checkExisting = async (key) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    await s3Client.send(new HeadObjectCommand(params));
    return true;
  } catch (err) {
    return false;
  }
};

const getKeyList = async (key) => {
  const keyList = [];
  const listObjectsV2Params = new ListObjectsCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key, // Start listing objects from the folder
  });

  const listedObjects = await s3Client.send(listObjectsV2Params);
  keyList.push(...listedObjects.Contents.map((obj) => obj.Key));

  // If there are subfolders (CommonPrefixes), call getKeyList recursively
  if (listedObjects.CommonPrefixes) {
    for (const prefix of listedObjects.CommonPrefixes) {
      const subfolderKey = prefix.Prefix;
      const subfolderKeys = await getKeyList(subfolderKey);
      keyList.push(...subfolderKeys);
    }
  }

  return keyList;
};

const makeArchive = async (key, res, folder) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key,
    StartAfter: key,
  };

  const { Contents } = await s3.listObjectsV2(params).promise(); // convert request to promise

  return new Promise((resolve, reject) => {
    // wrap into a promise
    const archive = archiver("zip", { gzip: true, zlib: { level: 9 } });
    archive.on("error", (err) => {
      reject(err);
    });
    archive.on("finish", () => {
      // end | close
      resolve(archive); // return to main function
    });
    archive.pipe(res);

    // error handler

    for (const content of Contents) {
      const regex = new RegExp(`.*\/${folder}\/`);
      const contentKey = content.Key.replace(regex, `${folder}/`);
      const file = s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: content.Key,
        })
        .createReadStream();
      archive.append(file, { name: contentKey });
    }

    archive.finalize();
  });
};

const downloadFile = async (path, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: path,
    };

    const { Body } = await s3Client.send(new GetObjectCommand(params));

    Body.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};
export {
  checkExisting,
  createFolder,
  deleteFile,
  deleteFolder,
  downloadFile,
  getKeyList,
  makeArchive,
  s3Client,
  uploadFile,
};
