import fs from "fs";
import express from "express";

const app = express();

app.get("/videos", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


app.get('/videos/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const videoPath = `videos/${fileName}.mp4`;
  const fileStat = fs.statSync(fullPath);
  const { size } = fileStat;
  const range = req.headers.range;
  if (range) {
    // example: bytes=17072128-
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0]);
    const end = parts[1] ? parseInt(parts[1]) : size - 1;
    const contentLength = end - start + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4'
    });
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream(videoPath).pipe(res);
  }
  
})

app.listen('3232');