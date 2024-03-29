import {
  DeleteObjectCommand,
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

// const makeArchive = async (key) => {
//   const zipName = `${key}.zip`;
//   const archive = archiver("zip", {
//     zlib: { level: 9 }, // Sets the compression level (optional)
//   });

//   const keyList = await getKeyList(key);

//   try {
//     await keyList.map(async (item) => {
//       const fileParams = new GetObjectCommand({
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: item, // Use the entire file key here
//       });

//       const fileStream = await s3Client.send(fileParams);
//       const readableStream = Readable.from(fileStream.Body)
//       archive.append(ReadableStream, { name: item.split("/").pop() });
//     });

//     // const s3WritableStream = getWritableStreamFromS3(key);
//     // archive.pipe(s3WritableStream);

//     archive.on("error", (err) => console.error("Error creating archive:", err));
//     archive.on("finish", () => console.log("Archive created:", zipName));

//     archive.finalize();

//     const output = archive.out;
//     console.log(output);

//     // const s3ZipParams = {
//     //   Bucket: process.env.S3_BUCKET_NAME,
//     //   Key: zipName,
//     //   Body: output,
//     //   ContentType: "application/zip",
//     // };

//     // await s3Client.send(new PutObjectCommand(s3ZipParams));
//     console.log("Archive uploaded to S3:", zipName);
//   } catch (error) {
//     console.error("Error creating or uploading archive:", error);
//   }
// };

// async function getReadableStreamFromS3(s3Key) {
//   const command = new GetObjectCommand({
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: s3Key,
//   });
//   const response = await s3Client.send(command);
//   return response.Body;
// }

// function getWritableStreamFromS3(zipFileS3Key) {
//   const passthrough = new stream.PassThrough();

//   new Upload({
//     client: s3Client,
//     params: {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: `${zipFileS3Key}.zip`,
//       Body: passthrough,
//     },
//   }).done();
//   console.log(passthrough);

//   return passthrough;
// }

const makeArchive = async (key, res) => {
  const s3Config = new AWS.Config({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    region: "eu-west-3",
  });
  const s3 = new AWS.S3(s3Config);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: key,
  };

  const { Contents } = await s3.listObjects(params).promise(); // convert request to promise

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
      const file = s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: content.Key,
        })
        .createReadStream();
      archive.append(file, { name: content.Key });
    }

    archive.finalize();
  });
};

export { checkExisting, createFolder, deleteFile, deleteFolder, getKeyList, makeArchive, s3Client, uploadFile };
